# Automacao dos prompts

Este projeto tem um assistente local para seguir os prompts restantes a partir do `oi.txt`.

## Ver o proximo prompt

```bat
scripts\prompt-assistant.bat next
```

O comando mostra o proximo prompt e copia o texto para a area de transferencia.

## Marcar prompt como concluido

```bat
scripts\prompt-assistant.bat done
```

Tambem e possivel marcar um numero especifico:

```bat
scripts\prompt-assistant.bat done 12
```

## Ver status

```bat
scripts\prompt-assistant.bat status
```

## Ajustar progresso manualmente

```bat
scripts\prompt-assistant.bat set 11
```

## Abrir o site no navegador

```bat
scripts\prompt-assistant.bat open-site
```

## Iniciar o site

```bat
scripts\prompt-assistant.bat start-site
```

Depois acesse:

```text
http://127.0.0.1:3000
```

## Observacao

Este script nao envia mensagens sozinho para o chat. Ele automatiza o controle local: mostra, copia, marca progresso e abre o site.
