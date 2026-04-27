@echo off
setlocal

cd /d "%~dp0"
title AutonomoPro - Inicializacao Local

echo.
echo ==========================================
echo   AutonomoPro - Inicializacao automatica
echo ==========================================
echo.

set "DB_CONTAINER=autonomopro-postgres"
set "DB_IMAGE=postgres:17"
set "DB_PORT=5432"
set "DB_NAME=siteautonomo"
set "DB_USER=postgres"
set "DB_PASSWORD=postgres"
set "SKIP_DB_SETUP=0"
set "LOCAL_PG_STARTED=0"
if not defined RUN_DB_SEED set "RUN_DB_SEED=prompt"

echo [1/8] Verificando PostgreSQL local...
for /f "usebackq delims=" %%i in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Service *postgres* -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Name) 2>$null"`) do set "PG_SERVICE_NAME=%%i"

if defined PG_SERVICE_NAME (
  echo Servico PostgreSQL encontrado: %PG_SERVICE_NAME%
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$service = Get-Service -Name '%PG_SERVICE_NAME%' -ErrorAction SilentlyContinue;" ^
    "if($service -and $service.Status -ne 'Running'){ Start-Service -Name '%PG_SERVICE_NAME%' -ErrorAction Stop }"
  if errorlevel 1 (
    echo AVISO: nao foi possivel iniciar o servico PostgreSQL local.
  ) else (
    echo PostgreSQL local iniciado com sucesso.
    set "LOCAL_PG_STARTED=1"
  )
) else (
  echo Nenhum servico PostgreSQL local foi encontrado.
)

if "%LOCAL_PG_STARTED%"=="1" goto :wait_for_db

echo [2/8] Verificando Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
  if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
    echo Docker nao estava pronto. Tentando abrir o Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Aguardando Docker Desktop iniciar por ate 60 segundos...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$deadline=(Get-Date).AddSeconds(60);" ^
      "while((Get-Date) -lt $deadline){" ^
      "  docker info *> $null;" ^
      "  if($LASTEXITCODE -eq 0){ exit 0 }" ^
      "  Start-Sleep -Seconds 3" ^
      "}" ^
      "exit 1"
    if errorlevel 1 (
      echo.
      echo AVISO: Docker Desktop nao iniciou a tempo.
      echo O app sera aberto mesmo assim, sem preparar banco local.
      set "SKIP_DB_SETUP=1"
    )
  ) else (
    echo.
    echo AVISO: Docker Desktop nao encontrado.
    echo O app sera aberto sem preparar banco local.
    set "SKIP_DB_SETUP=1"
  )
)

if "%SKIP_DB_SETUP%"=="1" goto :start_app

echo [3/8] Garantindo PostgreSQL local em container...
docker inspect %DB_CONTAINER% >nul 2>&1
if errorlevel 1 (
  echo Criando container %DB_CONTAINER%...
  docker run -d ^
    --name %DB_CONTAINER% ^
    -e POSTGRES_DB=%DB_NAME% ^
    -e POSTGRES_USER=%DB_USER% ^
    -e POSTGRES_PASSWORD=%DB_PASSWORD% ^
    -p %DB_PORT%:5432 ^
    %DB_IMAGE%
  if errorlevel 1 (
    echo.
    echo ERRO: nao foi possivel criar o container PostgreSQL.
    goto :end
  )
) else (
  for /f %%i in ('docker inspect -f "{{.State.Running}}" %DB_CONTAINER%') do set "DB_RUNNING=%%i"
  if /I not "%DB_RUNNING%"=="true" (
    echo Iniciando container existente %DB_CONTAINER%...
    docker start %DB_CONTAINER% >nul
    if errorlevel 1 (
      echo.
      echo ERRO: nao foi possivel iniciar o container PostgreSQL existente.
      goto :end
    )
  ) else (
    echo Container PostgreSQL ja esta em execucao.
  )
)

:wait_for_db
echo Aguardando PostgreSQL aceitar conexoes...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$deadline=(Get-Date).AddMinutes(2);" ^
  "while((Get-Date) -lt $deadline){" ^
  "  try{" ^
  "    $conn = New-Object System.Net.Sockets.TcpClient('127.0.0.1', %DB_PORT%);" ^
  "    $conn.Close();" ^
  "    exit 0" ^
  "  } catch { Start-Sleep -Seconds 2 }" ^
  "}" ^
  "exit 1"
if errorlevel 1 (
  echo.
  echo AVISO: PostgreSQL nao respondeu na porta %DB_PORT%.
  echo O app sera aberto sem preparar banco local.
  set "SKIP_DB_SETUP=1"
  goto :start_app
)

echo [4/8] Verificando autenticacao no banco...
node -e "const fs=require('fs'); const pg=require('pg'); const env=fs.readFileSync('.env','utf8'); const line=env.split(/\r?\n/).find(function(item){ return item.indexOf('DATABASE_URL=')===0; }); let url=line ? line.slice(line.indexOf('=')+1).trim() : ''; if(url.charCodeAt(0)===34 && url.charCodeAt(url.length-1)===34){ url=url.slice(1,-1); } if(!url){ console.error('DATABASE_URL nao encontrada no .env'); process.exit(1); } const pool=new pg.Pool({connectionString:url}); pool.query('select 1').then(function(){ process.exit(0); }).catch(function(error){ console.error(error.message); process.exit(1); }).finally(function(){ pool.end(); });"
if errorlevel 1 (
  echo.
  echo AVISO: nao foi possivel autenticar no PostgreSQL usando a DATABASE_URL do .env.
  echo Confira usuario/senha/banco no .env ou pare o PostgreSQL local para usar o container Docker.
  echo O app sera aberto mesmo assim, sem preparar banco local.
  set "SKIP_DB_SETUP=1"
  goto :start_app
)

echo [5/8] Aplicando schema Prisma...
call npx prisma db push
if errorlevel 1 (
  echo.
  echo AVISO: falha ao aplicar o schema Prisma.
  echo O app sera aberto mesmo assim.
  set "SKIP_DB_SETUP=1"
  goto :start_app
)

echo [6/8] Verificando seed de desenvolvimento...
if /I "%RUN_DB_SEED%"=="0" (
  echo Seed desativado por RUN_DB_SEED=0.
  goto :start_app
)
if /I "%RUN_DB_SEED%"=="prompt" (
  echo.
  echo AVISO: o seed recria os dados locais de desenvolvimento.
  set /p "RUN_SEED_ANSWER=Executar seed agora? (S/N): "
  if /I not "%RUN_SEED_ANSWER%"=="S" (
    echo Seed ignorado.
    goto :start_app
  )
)

echo Executando seed...
call npm run db:seed
if errorlevel 1 (
  echo.
  echo AVISO: falha ao executar o seed.
  echo O app sera aberto mesmo assim.
  set "SKIP_DB_SETUP=1"
)

:start_app
echo [7/8] Iniciando ambiente de desenvolvimento...
if "%SKIP_DB_SETUP%"=="1" (
  echo.
  echo MODO SEM BANCO:
  echo - O site vai abrir
  echo - Login/admin podem nao funcionar
  echo - Paginas publicas e parte da UI podem ser visualizadas
  echo.
  echo O login local foi bloqueado porque o banco de dados nao esta disponivel.
  echo Inicie o PostgreSQL e rode:
  echo   npx prisma db push
  echo   npm run db:seed
  echo.
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "try { $conn = New-Object System.Net.Sockets.TcpClient('127.0.0.1', 3000); $conn.Close(); exit 0 } catch { exit 1 }"
if not errorlevel 1 (
  echo Servidor ja responde em http://localhost:3000.
) else (
  echo Abrindo servidor Next.js em uma nova janela...
  start "AutonomoPro Next.js" cmd /k "cd /d ""%~dp0"" && npm run dev"
  echo Aguardando servidor responder por ate 45 segundos...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$deadline=(Get-Date).AddSeconds(45);" ^
    "while((Get-Date) -lt $deadline){" ^
    "  try{" ^
    "    $conn = New-Object System.Net.Sockets.TcpClient('127.0.0.1', 3000);" ^
    "    $conn.Close();" ^
    "    exit 0" ^
    "  } catch { Start-Sleep -Seconds 2 }" ^
    "}" ^
    "exit 1"
)
if errorlevel 1 (
  echo.
  echo AVISO: o servidor Next.js ainda nao respondeu em http://localhost:3000.
  echo Verifique a janela "AutonomoPro Next.js" para ver o erro.
  goto :end
)

echo [8/8] Abrindo navegador...
start "" http://localhost:3000/entrar

:end
echo.
echo Processo finalizado.
pause
endlocal
