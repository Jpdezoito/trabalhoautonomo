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

echo [1/6] Verificando PostgreSQL local...
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

echo [2/6] Verificando Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
  if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
    echo Docker nao estava pronto. Tentando abrir o Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Aguardando Docker Desktop iniciar por ate 20 segundos...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$deadline=(Get-Date).AddSeconds(20);" ^
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

echo [3/6] Garantindo PostgreSQL local em container...
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

echo [4/6] Aplicando schema Prisma...
call npx prisma db push
if errorlevel 1 (
  echo.
  echo AVISO: falha ao aplicar o schema Prisma.
  echo O app sera aberto mesmo assim.
  set "SKIP_DB_SETUP=1"
  goto :start_app
)

echo [5/6] Executando seed...
call npm run db:seed
if errorlevel 1 (
  echo.
  echo AVISO: falha ao executar o seed.
  echo O app sera aberto mesmo assim.
  set "SKIP_DB_SETUP=1"
)

:start_app
echo [6/6] Abrindo navegador...
start "" http://localhost:3000/entrar

echo [7/6] Iniciando ambiente de desenvolvimento...
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
call npm run dev
if errorlevel 1 (
  echo.
  echo ERRO: falha ao iniciar o servidor Next.js.
  goto :end
)

:end
echo.
echo Processo finalizado.
pause
endlocal
