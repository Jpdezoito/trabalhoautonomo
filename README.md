# AutonomoPro

Marketplace profissional para prestadores de servicos autonomos e clientes locais. A plataforma cobre categorias amplas, incluindo servicos tecnicos, casa, obra, reparos, transporte, entregas, mudancas, limpeza, beleza, cuidados e demandas freelance.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Prisma 7
- PostgreSQL
- NextAuth

## Principais rotas

- `/` - pagina publica com busca, categorias e profissionais em destaque
- `/buscar` - listagem filtrada por servico, categoria, subcategoria, cidade e bairro
- `/categorias` - navegacao por categorias e subcategorias de servicos
- `/categorias/[slug]` - pagina de categoria com servicos comuns e profissionais relacionados
- `/profissionais/[slug]` - perfil publico com portfolio, avaliacoes, WhatsApp e pedido de orcamento
- `/entrar` - login
- `/cadastro` - selecao de tipo de conta
- `/cadastro/cliente` - cadastro de cliente
- `/cadastro/profissional` - cadastro de profissional
- `/painel/cliente` - dashboard do cliente
- `/painel/profissional` - dashboard do profissional
- `/admin` - painel administrativo
- `/admin/categorias` - gestao de categorias
- `/admin/profissionais` - verificacao e moderacao de profissionais
- `/admin/orcamentos` - acompanhamento de orcamentos
- `/admin/configuracoes` - configuracoes da plataforma

## Estrutura

- `src/app` - rotas e telas da aplicacao
- `src/components` - componentes reutilizaveis de layout, marketplace, dashboard e UI
- `src/config` - rotas, navegacao e configuracoes globais
- `src/features` - modulos de negocio por dominio
- `src/lib` - dados iniciais, Prisma, NextAuth e utilitarios
- `src/types` - tipos compartilhados
- `prisma/schema.prisma` - modelo relacional da plataforma
- `prisma.config.ts` - configuracao Prisma 7

Veja a referencia completa em `docs/ARCHITECTURE.md`.
Veja os padroes visuais em `docs/DESIGN_SYSTEM.md`.

## Banco de dados

Configure `DATABASE_URL` no arquivo `.env`.

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev
```

## Desenvolvimento

```bash
npm run dev
```

## Verificacao

```bash
npm run lint
npm run build
npx prisma validate
```
