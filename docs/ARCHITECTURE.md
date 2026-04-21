# Arquitetura da Plataforma

AutonomoPro e um marketplace modular para conectar clientes a prestadores autonomos locais em muitas frentes de trabalho: servicos tecnicos, casa, obra, reparos, transporte, entregas, mudancas, limpeza, beleza, cuidados e servicos freelance.

## Estrutura principal

```text
src/
├─ app/             Rotas Next.js e route handlers
├─ components/      Componentes compartilhados
├─ config/          Configuracoes, rotas e navegacao
├─ features/        Modulos de negocio
├─ lib/             Infraestrutura e utilitarios
└─ types/           Tipos globais
```

## Modulos de negocio

- `features/auth`: autenticacao, cadastro e contratos de login.
- `features/search`: filtros, normalizacao e busca de profissionais.
- `features/profiles`: perfil publico de profissional.
- `features/workers`: dashboard e operacoes do profissional.
- `features/clients`: dashboard e operacoes do cliente.
- `features/portfolio`: galeria e projetos concluidos.
- `features/quotes`: solicitacoes de orcamento e ciclo de status.
- `features/reviews`: avaliacoes e notas.
- `features/favorites`: profissionais favoritos.
- `features/moderation`: verificacao, revisao e moderacao.
- `features/settings`: configuracoes operacionais.
- `features/admin`: gestao administrativa e metricas.

## Catalogo de servicos

O catalogo nao deve ser tratado como lista fixa de profissoes. A plataforma usa grupos, categorias e subcategorias para representar demandas amplas e especializacoes flexiveis.

- Grupo: organiza areas grandes, como `Transporte e entregas`, `Mudancas`, `Casa e manutencao` e `Servicos tecnicos`.
- Categoria: pagina navegavel e filtro publico, como `Frete`, `Entrega rapida`, `Limpeza` ou `Eletricistas`.
- Subcategoria: especializacao relacionada a uma categoria principal, como `Motoboy`, `Motofrete`, `Carreto` e `Transporte de moveis`.
- Perfil profissional: pode estar vinculado a varias categorias/subcategorias para representar trabalhadores multidisciplinares.
- Busca: deve aceitar categoria principal, subcategoria, palavra-chave, cidade, bairro, avaliacao, preco, disponibilidade e verificacao.

## Mapa de rotas

| Area | Rota | Responsabilidade |
| --- | --- | --- |
| Publica | `/` | Apresentacao, busca e profissionais em destaque |
| Publica | `/buscar` | Resultados filtrados por servico, categoria, subcategoria, cidade, bairro, preco, avaliacao e disponibilidade |
| Publica | `/categorias` | Navegacao por grupos, categorias e subcategorias de servicos |
| Publica | `/categorias/[slug]` | Pagina de categoria ou subcategoria com explicacao, servicos comuns e profissionais relacionados |
| Publica | `/profissionais/[slug]` | Perfil publico, portfolio, avaliacoes e orcamento |
| Auth | `/entrar` | Login |
| Auth | `/cadastro` | Escolha entre cliente e profissional |
| Auth | `/cadastro/cliente` | Cadastro de cliente |
| Auth | `/cadastro/profissional` | Cadastro de profissional |
| API | `/api/auth/[...nextauth]` | NextAuth |
| Cliente | `/painel/cliente` | Orcamentos, favoritos e avaliacoes |
| Profissional | `/painel/profissional` | Leads, perfil, portfolio e verificacao |
| Admin | `/admin` | Visao geral administrativa |
| Admin | `/admin/categorias` | Gestao de categorias |
| Admin | `/admin/profissionais` | Verificacao e moderacao de profissionais |
| Admin | `/admin/orcamentos` | Monitoramento de orcamentos |
| Admin | `/admin/configuracoes` | Configuracoes da plataforma |

## Fluxo principal

1. Cliente busca profissionais por servico, categoria, subcategoria, cidade e bairro.
2. Cliente abre o perfil publico para analisar portfolio, avaliacoes e areas atendidas.
3. Cliente solicita orcamento ou chama no WhatsApp.
4. Profissional acompanha leads no painel, responde e atualiza status.
5. Cliente salva favoritos, acompanha orcamentos e publica avaliacoes.
6. Administrador revisa grupos, categorias, subcategorias, perfis, verificacoes, moderacao e configuracoes.

## Principios

- Rotas em `src/app` devem ser finas.
- Regras de negocio ficam em `src/features`.
- Componentes visuais reutilizaveis ficam em `src/components`.
- Contratos de entrada usam Zod.
- Prisma representa o modelo relacional de producao.
- Novos modulos devem expor um `index.ts` para importacoes estaveis.
