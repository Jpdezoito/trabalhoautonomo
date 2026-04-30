# Arquitetura do AutonomoPro

Este documento descreve a arquitetura do AutonomoPro para novos desenvolvedores e stakeholders técnicos. O objetivo é explicar como as principais camadas do sistema se conectam, onde ficam as regras de negócio e quais decisões sustentam a evolução da plataforma.

## 1. Visão Geral da Arquitetura

O AutonomoPro é uma aplicação web full-stack construída com Next.js App Router, React, TypeScript, Prisma e PostgreSQL. A arquitetura combina renderização no servidor, rotas de API internas e uma camada de domínio organizada por módulos em `src/features`.

```text
Usuário
  |
  v
Next.js App Router
  |
  |-- Server Components e páginas em src/app
  |-- Client Components para formulários e interações
  |-- Route Handlers em src/app/api
  |
  v
Camada de domínio
  |
  |-- src/features: módulos de negócio
  |-- src/lib: infraestrutura, sessão, Prisma e serviços compartilhados
  |-- src/components: componentes reutilizáveis
  |
  v
Prisma Client
  |
  v
PostgreSQL
```

### Frontend

O frontend fica principalmente em `src/app`, `src/components` e nos componentes de cada domínio em `src/features`.

- `src/app`: define rotas públicas, painéis, páginas administrativas e API Routes.
- `src/components`: concentra componentes visuais compartilhados, como layout, UI base e marketplace.
- `src/features/*/components`: contém componentes ligados a um domínio específico.
- `src/config`: centraliza rotas, navegação e configurações de plataforma.

A interface usa o App Router do Next.js. Páginas podem ser Server Components por padrão, buscando dados no servidor antes da renderização. Componentes interativos usam Client Components quando precisam de estado, eventos, formulários ou APIs do navegador.

### Backend

O backend é implementado dentro do próprio Next.js por meio de Route Handlers em `src/app/api`. Essas rotas recebem requisições HTTP, validam entradas, executam regras de negócio e persistem dados via Prisma.

Exemplos:

- `src/app/api/auth/[...nextauth]/route.ts`: autenticação via NextAuth.
- `src/app/api/quotes/route.ts`: criação de pedidos de orçamento.
- `src/app/api/favorites/route.ts`: gestão de favoritos.
- `src/app/api/reviews/route.ts`: criação e consulta de avaliações.
- `src/app/api/trust/requests/route.ts`: solicitações de verificação de confiança.
- `src/app/api/profissional/disponibilidade/route.ts`: disponibilidade do profissional.

### Banco de Dados

O banco de dados é PostgreSQL, acessado por Prisma. O schema central fica em `prisma/schema.prisma` e modela os principais conceitos da plataforma:

- usuários, sessões e contas;
- perfis de cliente, profissional e administrador;
- categorias, serviços e áreas de atendimento;
- pedidos de orçamento, mensagens e avaliações;
- favoritos, leads e contatos;
- verificação de identidade, confiança, evidências e moderação;
- configurações, notificações e logs administrativos.

O acesso ao banco passa pelo Prisma Client configurado em `src/lib/prisma.ts`, usando `@prisma/adapter-pg` e pool de conexões do pacote `pg`.

## 2. Fluxo de Dados

O fluxo de dados varia conforme a tela, mas segue um padrão consistente: a UI dispara uma ação, o Next.js processa a requisição no servidor, Prisma lê ou grava no PostgreSQL, e a resposta volta para a interface.

### Fluxo de leitura com Server Components

1. O usuário acessa uma rota, como `/`, `/buscar`, `/profissionais/[slug]` ou um painel.
2. O App Router executa o componente de página em `src/app`.
3. A página chama funções de dados em `src/lib` ou `src/features`.
4. Essas funções usam Prisma para consultar o PostgreSQL.
5. Os dados são mapeados para estruturas usadas pela interface.
6. O HTML é renderizado no servidor e entregue ao navegador.

Exemplo conceitual:

```text
/profissionais/[slug]
  -> página Next.js
  -> src/lib/marketplace-server.ts
  -> prisma.workerProfile.findUnique(...)
  -> PostgreSQL
  -> dados do perfil público
  -> componentes de marketplace
```

### Fluxo de escrita com API Routes

1. Um Client Component envia dados por `fetch` para uma rota em `src/app/api`.
2. A API Route lê o corpo da requisição.
3. A entrada é validada com schemas Zod do domínio.
4. A rota chama serviços ou helpers de negócio.
5. Prisma grava ou atualiza os registros no PostgreSQL.
6. A rota retorna JSON com status HTTP apropriado.
7. A interface atualiza estado, mostra feedback ou redireciona o usuário.

Exemplo: solicitação de orçamento.

```text
QuoteRequestForm
  -> POST /api/quotes
  -> quoteRequestSchema.safeParse(...)
  -> findWorkerProfileBySlug(...)
  -> getOrCreateClientProfile(...)
  -> estimateQuotePrice(...)
  -> prisma.quoteRequest.create(...)
  -> resposta JSON com id, código, status e estimativa
```

### Server Components, API Routes e Prisma

Os Server Components são adequados para leitura de dados e renderização inicial, porque executam no servidor e podem chamar diretamente funções que acessam Prisma. Já as API Routes são usadas quando há interação do navegador, envio de formulário, mutação de estado ou integração que precisa responder em JSON.

Regra prática:

- leitura inicial e composição de tela: Server Components;
- mutações disparadas pela UI: API Routes;
- acesso persistente: Prisma Client;
- contratos de entrada: Zod;
- sessão e autorização: NextAuth, helpers em `src/lib/app-session.ts` e lógica de roteamento por papel.

## 3. Módulos e Domínios

A pasta `src/features` organiza os módulos de negócio. Cada módulo agrupa seus componentes, schemas, serviços, tipos e regras relacionadas ao domínio.

```text
src/features/
  admin/
  auth/
  categories/
  clients/
  favorites/
  identity/
  moderation/
  portfolio/
  profiles/
  quotes/
  recovery/
  reviews/
  search/
  settings/
  trust/
  workers/
```

### `auth`

Responsável por autenticação e contratos de login. Usa NextAuth com provider de credenciais, bcrypt para validação de senha e Prisma Adapter para persistência.

Relaciona-se com:

- `User`, `Account`, `Session` e `VerificationToken` no Prisma;
- rotas `/entrar`, `/cadastro`, `/pos-login`;
- proteção de painéis e redirecionamento por papel.

### `clients`

Contém onboarding, dashboard e telas operacionais do cliente. O domínio se conecta a pedidos de orçamento, favoritos, avaliações e preferências.

Principais entidades:

- `ClientProfile`;
- `QuoteRequest`;
- `Favorite`;
- `Review`;
- `ContactRequest`.

### `workers`

Agrupa onboarding, painel profissional, disponibilidade e configurações específicas do prestador. É um dos domínios centrais do marketplace.

Principais entidades:

- `WorkerProfile`;
- `WorkerService`;
- `WorkerServiceArea`;
- `PortfolioImage`;
- `WorkerEvidence`;
- `WorkerQualification`;
- `ProfessionalPlan`.

### `categories`

Organiza o catálogo de categorias e serviços. Sustenta navegação pública, filtros e vinculação de profissionais a áreas de atuação.

Principais entidades:

- `Category`;
- `Service`;
- `WorkerService`.

### `search`

Cuida da experiência de busca e filtros. A lógica atual considera palavra-chave, serviço, categoria, cidade, bairro, preço, disponibilidade, qualidade e ordenação por relevância.

Relaciona-se com:

- dados públicos de profissionais;
- componentes de resultado de busca;
- categorias e serviços;
- plano do profissional, avaliação e verificação para ordenação.

### `profiles`

Centraliza acesso e modelagem de perfis públicos. Trabalha próximo de `marketplace-server`, componentes de perfil, portfólio, avaliações e ações de contato.

### `quotes`

Responsável pelo ciclo de orçamento. Inclui formulário, schemas, tipos, geração de códigos, status e telas de acompanhamento.

Principais entidades:

- `QuoteRequest`;
- `QuoteMessage`;
- `QuoteStatus`;
- `QuotePriority`.

### `reviews`

Gerencia avaliações de clientes sobre profissionais e suporte à moderação administrativa.

Principais entidades:

- `Review`;
- `ReviewStatus`;
- relação com `WorkerProfile`, `ClientProfile` e, opcionalmente, `QuoteRequest`.

### `favorites`

Permite que clientes salvem profissionais. Usa relação composta entre `ClientProfile` e `WorkerProfile`.

### `portfolio`

Cuida da gestão de imagens e evidências visuais do trabalho do profissional.

Principais entidades:

- `PortfolioImage`;
- `WorkerEvidence`;
- status de moderação e verificação.

### `identity`, `trust` e `moderation`

Esses módulos compõem a camada de segurança, confiança e qualidade da plataforma.

- `identity`: verificação facial e enrollment.
- `trust`: solicitações de verificação de confiança, documentos, endereço, telefone, atividade, portfólio e experiência.
- `moderation`: denúncias, revisão administrativa e ações sobre conteúdo ou usuários.

### `settings`

Agrupa painéis de configuração para cliente e profissional, incluindo preferências, privacidade e visibilidade.

### `admin`

Consolida telas e dados administrativos: usuários, clientes, profissionais, categorias, avaliações, moderação, verificações, orçamentos e configurações.

## 4. Diagrama de Componentes (Texto)

### Autenticação

```text
LoginForm
  -> /api/auth/[...nextauth]
  -> NextAuth CredentialsProvider
  -> bcrypt.compare(...)
  -> prisma.user.findUnique(...)
  -> JWT session com user.id e user.role
  -> Header, painéis e redirecionamento por papel
```

A autenticação é o ponto de entrada para clientes, profissionais e administradores. A sessão carrega o papel do usuário (`CLIENT`, `WORKER`, `ADMIN`, `SUPER_ADMIN`), que orienta navegação, acesso a painéis e pós-login.

### Gerenciamento de Usuários

```text
Cadastro / Onboarding
  -> schemas Zod do domínio
  -> criação de User
  -> criação de ClientProfile, WorkerProfile ou AdminProfile
  -> painel correspondente
```

O modelo `User` representa a identidade principal. Perfis específicos são separados em tabelas próprias, permitindo que regras de cliente, profissional e administrador evoluam sem sobrecarregar a entidade base.

### Marketplace

```text
Home, Categorias, Busca e Perfil Público
  -> dados de categorias, serviços e profissionais
  -> WorkerProfile + Services + Areas + Reviews + Portfolio
  -> componentes de marketplace
  -> ações: favoritar, solicitar orçamento, contato e WhatsApp
```

O marketplace conecta o catálogo de serviços aos perfis profissionais. A busca combina dados estruturados, como cidade e categoria, com sinais de qualidade, como disponibilidade, plano, avaliação, portfólio e verificação.

### Orçamentos

```text
QuoteRequestPanel / QuoteRequestForm
  -> POST /api/quotes
  -> validação com quoteRequestSchema
  -> WorkerProfile por slug
  -> ClientProfile existente ou criado automaticamente
  -> estimativa de preço
  -> QuoteRequest no PostgreSQL
  -> painel do cliente e painel do profissional
```

O orçamento liga cliente, profissional, serviço, localização, status e estimativas de preço. Ele também se conecta a mensagens, avaliações, contatos e moderação.

### Confiança, Verificação e Moderação

```text
TrustVerificationCard / FacialEnrollmentCard / AdminReviewTable
  -> APIs de identity ou trust
  -> registros de ConsentRecord, FacialEnrollment e TrustVerificationRequest
  -> revisão administrativa
  -> atualização de status público do perfil
```

Essa camada aumenta a confiabilidade do marketplace. As verificações podem alimentar badges públicos, decisões de moderação e critérios de qualidade.

## 5. Considerações de Escalabilidade

A arquitetura atual já oferece uma base escalável para o estágio do produto.

### Pontos que ajudam a escalar

- Separação por domínio em `src/features`, reduzindo acoplamento entre áreas de negócio.
- Uso de Prisma com schema relacional explícito, facilitando migrações e integridade referencial.
- Índices no Prisma para consultas comuns, como status, cidade, bairro, plano, disponibilidade e datas.
- App Router com Server Components, reduzindo JavaScript no cliente e centralizando consultas de leitura no servidor.
- API Routes internas para mutações, com validação e respostas padronizadas.
- TypeScript e Zod para reduzir erros de contrato entre UI, APIs e dados.
- Separação entre componentes compartilhados e componentes de domínio.

### Pontos de atenção para o futuro

- Busca: filtros em memória ou consultas simples podem se tornar insuficientes com muitos profissionais. A evolução natural é mover a busca para consultas SQL otimizadas, índices específicos, materialized views ou um motor dedicado.
- Cache: páginas públicas de categorias, perfis e busca podem precisar de cache, revalidação e invalidação orientada por eventos.
- Observabilidade: logs estruturados, tracing e métricas serão importantes para APIs de orçamento, login, verificação e checkout.
- Filas assíncronas: tarefas como e-mail, WhatsApp, moderação automática, verificação documental e notificações devem migrar para filas quando o volume crescer.
- Autorização granular: o papel do usuário já existe, mas permissões administrativas e políticas por recurso podem precisar de uma camada mais formal.
- Uploads e arquivos: evidências, documentos e portfólio devem ter estratégia clara de armazenamento, antivírus, expiração de links e controle de acesso.
- Transações: fluxos que criam múltiplas entidades relacionadas, como onboarding completo ou contratação, devem usar transações quando houver risco de estado parcial.
- Paginação: listagens administrativas, orçamentos, avaliações e busca pública devem manter paginação consistente para evitar consultas grandes.
- Planos e pagamentos: o modelo `ProfessionalPlan` existe, mas integração de checkout, assinatura, webhooks e reconciliação financeira deve ser isolada em um domínio próprio quando implementada.

## 6. Decisões de Design

### Next.js App Router

O App Router foi escolhido por permitir uma arquitetura full-stack em um único projeto, com rotas de página, layouts, Server Components e Route Handlers. Isso reduz a complexidade operacional inicial, porque frontend e backend compartilham tipos, estrutura de pastas e deploy.

### Server Components como padrão

Server Components são adequados para páginas que dependem de dados do banco, como home, busca, perfis e painéis. Eles evitam expor lógica sensível ao navegador e reduzem a quantidade de JavaScript enviada ao cliente.

### API Routes para mutações

As mutações ficam em Route Handlers para manter um contrato HTTP claro entre a UI e o backend. Isso é usado em ações como criar orçamento, favoritar profissional, registrar avaliação, alterar disponibilidade e enviar verificações.

### TypeScript

TypeScript é usado para dar segurança aos contratos internos, reduzir erros em refatorações e documentar estruturas de dados. Ele é especialmente útil em um projeto com muitos domínios e relações entre modelos.

### Prisma

Prisma centraliza o acesso ao PostgreSQL e mantém o schema do banco versionado junto ao código. A modelagem relacional é adequada ao domínio do AutonomoPro, que possui muitas relações fortes entre usuários, perfis, serviços, orçamentos, avaliações e verificações.

### PostgreSQL

PostgreSQL é uma escolha sólida para dados relacionais, consultas por filtros, integridade referencial e evolução do marketplace. O schema usa índices para campos frequentes de busca e operação, como status, cidade, bairro, plano, disponibilidade e datas.

### Zod

Zod valida entradas de formulários e APIs antes que os dados cheguem ao banco. Isso cria uma fronteira clara entre dados externos e regras internas da aplicação.

### Organização por Domínio

O uso de `src/features` evita que regras de negócio fiquem espalhadas pelas páginas. Cada domínio pode evoluir com seus próprios schemas, tipos, serviços e componentes, enquanto `src/app` permanece focado em rotas e composição de tela.

### Configuração Centralizada

Arquivos em `src/config`, como rotas e navegação, reduzem duplicação e evitam divergências entre desktop, mobile, menus públicos e painéis.

## Estrutura de Referência

```text
src/
  app/                 Rotas, layouts, páginas e API Routes
  components/          Layouts, UI base e componentes compartilhados
  config/              Rotas, navegação e constantes de plataforma
  features/            Domínios de negócio
  lib/                 Prisma, autenticação, sessão, dados de marketplace e utilitários
  types/               Tipos compartilhados

prisma/
  schema.prisma        Modelo relacional principal
  migrations/          Migrações versionadas
  seed.js              Dados iniciais de desenvolvimento
```

## Convenções Recomendadas

- Manter páginas em `src/app` finas, delegando regras para `src/features` ou `src/lib`.
- Criar schemas Zod para toda entrada externa relevante.
- Usar Prisma apenas no servidor.
- Preferir Server Components para leitura inicial de dados.
- Usar Client Components apenas quando houver interação real no navegador.
- Exportar APIs estáveis por `index.ts` nos módulos de domínio.
- Manter nomes de rotas e navegação em `src/config`.
- Adicionar índices e paginação sempre que uma consulta puder crescer em volume.
