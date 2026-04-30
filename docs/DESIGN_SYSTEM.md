# Design System do AutonomoPro

Este documento define os padrões visuais e de experiência do AutonomoPro. Ele deve orientar a criação de novas telas, componentes e fluxos para manter consistência, acessibilidade e clareza operacional.

## 1. Princípios de Design

### Confiança primeiro

O AutonomoPro conecta clientes a profissionais locais. A interface deve transmitir segurança, legitimidade e clareza em cada etapa: busca, perfil, orçamento, avaliação, verificação e painel.

Diretrizes:

- usar textos diretos, sem promessas vagas;
- destacar sinais de confiança, como verificação, avaliações e localização;
- evitar excesso visual em ações críticas, como cadastro, login e orçamento;
- manter estados e feedbacks explícitos.

### Clareza operacional

A plataforma combina experiência pública de marketplace com painéis de cliente, profissional e administração. As telas devem priorizar leitura rápida, hierarquia clara e ações fáceis de localizar.

Diretrizes:

- manter títulos curtos e descrições objetivas;
- organizar informações em seções previsíveis;
- evitar elementos decorativos que concorram com dados e ações;
- manter a ação principal visualmente evidente.

### Consistência por domínio

Fluxos semelhantes devem usar os mesmos padrões visuais. Um card de profissional, um card de plano e um painel administrativo podem ter conteúdos diferentes, mas devem compartilhar raio, borda, sombra, espaçamento e estados.

Diretrizes:

- reutilizar componentes de `src/components/ui` sempre que possível;
- centralizar rotas, navegação e textos estruturais;
- evitar variações visuais pontuais sem necessidade de produto.

### Mobile primeiro

Clientes e profissionais podem acessar a plataforma pelo celular. A experiência deve funcionar bem em telas pequenas antes de ser expandida para desktop.

Diretrizes:

- grids começam em uma coluna e expandem em `sm`, `md` ou `lg`;
- botões principais devem ser fáceis de tocar;
- textos e ações não devem sobrepor imagens ou outros elementos;
- menus responsivos devem ter os mesmos itens essenciais do desktop.

## 2. Tipografia

### Fontes

O projeto usa fontes do Next.js:

- `Geist`: fonte principal da interface;
- `Geist Mono`: fonte monoespaçada para usos técnicos, quando necessário.

Definição em `src/app/layout.tsx`:

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

Tokens em `src/app/globals.css`:

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### Hierarquia tipográfica

Use a escala do Tailwind CSS, mantendo pesos fortes para títulos e pesos médios ou regulares para textos de apoio.

| Uso | Classes recomendadas | Observação |
| --- | --- | --- |
| Título de página | `text-4xl font-black tracking-tight` | Usar em páginas públicas e headers principais. |
| Título de seção | `text-3xl font-black tracking-tight sm:text-4xl` | Padrão do `SectionHeader`. |
| Título de card | `text-xl font-black tracking-tight` | Padrão do `CardTitle`. |
| Subtítulo/descrição | `text-base leading-7 text-muted` | Usar para explicar seções. |
| Texto de corpo | `text-sm leading-6 text-muted` | Bom para cards, listas e painéis. |
| Label de formulário | `text-sm font-bold text-muted-strong` | Padrão do `Label`. |
| Texto auxiliar | `text-xs leading-5 text-muted` | Padrão do `FieldHint`. |
| Erro de campo | `text-xs font-semibold leading-5 text-danger` | Padrão do `FieldError`. |

Exemplo:

```tsx
<SectionHeader
  eyebrow="Profissionais verificados"
  title="Encontre ajuda perto de você"
  description="Compare avaliações, disponibilidade e serviços antes de pedir orçamento."
/>
```

### Regras de uso

- Use `font-black` apenas para títulos, números importantes e marca.
- Use `font-bold` para labels, navegação e elementos acionáveis.
- Use `text-muted` para conteúdo secundário, nunca para a informação mais importante.
- Evite reduzir fonte abaixo de `text-xs`.
- Não use espaçamento negativo entre letras.
- Use `text-balance` em títulos longos de seções públicas.

## 3. Cores

As cores são definidas como tokens CSS em `src/app/globals.css` e expostas ao Tailwind via `@theme inline`.

### Paleta principal

| Token | Valor | Uso |
| --- | --- | --- |
| `--background` | `#f6f3ed` | Fundo geral da aplicação. |
| `--foreground` | `#202522` | Texto principal. |
| `--surface` | `#ffffff` | Cards, formulários, header e superfícies elevadas. |
| `--surface-muted` | `#f2eee6` | Áreas secundárias, rodapés de cards e blocos internos. |
| `--surface-strong` | `#ebe4d7` | Superfícies de maior contraste. |
| `--border` | `#ddd5c6` | Bordas padrão. |
| `--border-strong` | `#c9bea8` | Bordas em hover ou destaque. |
| `--primary` | `#0f766e` | Ações principais, links ativos e marca. |
| `--primary-strong` | `#0b5f59` | Hover de ação principal. |
| `--primary-soft` | `#dff4ef` | Fundo suave para badges, hover e ícones. |
| `--accent` | `#e7b84b` | Destaques, rating e CTA secundário. |
| `--accent-strong` | `#b7791f` | Texto ou contraste de destaque. |
| `--muted` | `#66736b` | Texto auxiliar. |
| `--muted-strong` | `#47544c` | Texto secundário com maior contraste. |

### Cores semânticas

| Token | Valor | Uso |
| --- | --- | --- |
| `--success` | `#237a57` | Sucesso, verificação aprovada, conclusão. |
| `--success-soft` | `#dff3e8` | Fundo de estado positivo. |
| `--warning` | `#9a6a16` | Atenção, pendência, aviso. |
| `--warning-soft` | `#f7edcc` | Fundo de aviso. |
| `--danger` | `#b9433b` | Erro, ação destrutiva, rejeição. |
| `--danger-soft` | `#f8dfdc` | Fundo de erro. |
| `--info` | `#3a6f8f` | Informação, status neutro de processo. |
| `--info-soft` | `#deedf5` | Fundo informativo. |

### Diretrizes de uso

- `primary`: use para ação principal da tela, links importantes e estados ativos.
- `accent`: use para CTA secundário, avaliações com estrela e destaques pontuais.
- `danger`: use apenas para erro ou ação destrutiva.
- `success`, `warning` e `info`: use para status e feedbacks.
- Nunca comunique status apenas por cor; acompanhe com texto ou ícone.
- Evite criar novas cores diretamente no componente. Prefira tokens existentes.

Exemplo:

```tsx
<Badge variant="success">Verificado</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="danger">Rejeitado</Badge>
```

## 4. Componentes UI

Os componentes reutilizáveis ficam principalmente em `src/components/ui`, com composições de domínio em `src/components/layout`, `src/components/marketplace` e `src/components/dashboard`.

### `Button` e `LinkButton`

Arquivo: `src/components/ui/button.tsx`

Use `Button` para ações locais e `LinkButton` para navegação.

Variantes:

- `primary`: ação principal;
- `secondary`: CTA secundário com destaque em amarelo;
- `outline`: ação secundária neutra;
- `ghost`: ação discreta;
- `danger`: ação destrutiva;
- `subtle`: ação leve com fundo `primary-soft`.

Tamanhos:

- `sm`: `h-9 px-3 text-sm`;
- `md`: `h-11 px-5 text-sm`;
- `lg`: `h-12 px-6 text-base`;
- `xl`: `h-14 px-7 text-base`.

Exemplo:

```tsx
import { Button, LinkButton } from "@/components/ui/button";

<Button type="submit">Salvar alterações</Button>

<LinkButton href="/cadastro/profissional" variant="secondary">
  Cadastrar como profissional
</LinkButton>
```

Diretrizes:

- uma tela deve ter uma ação primária clara;
- botões lado a lado devem ter o mesmo tamanho visual;
- use `disabled` para estados de carregamento ou indisponibilidade;
- botões apenas com ícone precisam de `aria-label`;
- preserve raio de `8px`.

### `Badge`

Arquivo: `src/components/ui/badge.tsx`

Usado para status, categorias, planos, serviços e sinais rápidos.

Variantes:

- `neutral`;
- `primary`;
- `success`;
- `warning`;
- `danger`;
- `info`.

Exemplo:

```tsx
<Badge variant="primary">Eletricista</Badge>
<Badge variant="success">Identidade verificada</Badge>
```

Diretrizes:

- badges devem ser curtos;
- evite frases longas;
- use variante semântica quando representar status;
- use `primary` para categorias e serviços.

### `Card`, `CardHeader`, `CardContent` e `CardTitle`

Arquivo: `src/components/ui/card.tsx`

Cards são superfícies para agrupar conteúdo relacionado.

Variantes:

- `default`: card padrão;
- `elevated`: destaque visual moderado;
- `muted`: superfície secundária;
- `interactive`: card clicável ou com hover.

Exemplo:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Orçamentos recentes</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do painel
  </CardContent>
</Card>
```

Diretrizes:

- não coloque cards dentro de cards sem necessidade clara;
- use `interactive` apenas quando o card inteiro tiver comportamento de seleção ou navegação;
- mantenha `p-5 sm:p-6` como espaçamento base;
- cards repetidos em grid devem ter altura consistente quando possuírem CTAs no rodapé.

### Formulários

Arquivo: `src/components/ui/form.tsx`

Componentes:

- `FieldGroup`;
- `Field`;
- `Label`;
- `Input`;
- `Select`;
- `Textarea`;
- `FieldHint`;
- `FieldError`.

Exemplo:

```tsx
import { Field, FieldError, FieldGroup, FieldHint, Input, Label, Select } from "@/components/ui/form";

<FieldGroup>
  <Field>
    <Label htmlFor="name">Nome</Label>
    <Input id="name" name="name" placeholder="Seu nome" />
    <FieldHint>Use o nome que aparecerá no perfil.</FieldHint>
  </Field>

  <Field>
    <Label htmlFor="category">Categoria</Label>
    <Select id="category" name="category">
      <option>Eletricista</option>
      <option>Encanador</option>
    </Select>
    <FieldError>Selecione uma categoria.</FieldError>
  </Field>
</FieldGroup>
```

Diretrizes:

- labels ficam sempre acima dos campos;
- erros devem aparecer próximos ao campo correspondente;
- placeholders não substituem labels;
- inputs, selects e textareas usam foco com borda `primary` e ring suave;
- grupos usam `grid gap-4 sm:grid-cols-2`.

### `AutocompleteInput`

Arquivo: `src/components/ui/autocomplete-input.tsx`

Usado quando o usuário escolhe entre opções filtráveis, como cidade, bairro ou serviço.

Exemplo:

```tsx
<AutocompleteInput
  label="Cidade"
  value={city}
  onChange={setCity}
  options={cities}
  placeholder="Digite sua cidade"
/>
```

Diretrizes:

- use para listas médias ou grandes;
- mantenha mensagem vazia clara;
- preserve navegação por teclado;
- associe com fluxo de formulário quando houver `onEnterNext`.

### `Modal`

Arquivo: `src/components/ui/modal.tsx`

Usado para diálogos de confirmação, edição curta ou feedback bloqueante.

Exemplo:

```tsx
<Modal
  title="Confirmar ação"
  description="Revise as informações antes de continuar."
  footer={<Button>Confirmar</Button>}
>
  Conteúdo do modal
</Modal>
```

Diretrizes:

- modais devem ter título claro;
- botão de fechar deve ter `aria-label`;
- use footer para ações;
- evite formulários longos em modal.

### `Dropdown`

Arquivo: `src/components/ui/dropdown.tsx`

Usado para menus compactos acionados por botão.

Exemplo:

```tsx
<Dropdown label="Ações" align="right">
  <DropdownItem>Editar perfil</DropdownItem>
  <DropdownItem>Ver histórico</DropdownItem>
</Dropdown>
```

Diretrizes:

- use para poucas ações relacionadas;
- evite esconder ações críticas;
- alinhe à direita quando estiver no fim de uma barra ou tabela.

### `SectionHeader`

Arquivo: `src/components/ui/section-header.tsx`

Padroniza títulos de seções públicas e de painéis.

Exemplo:

```tsx
<SectionHeader
  eyebrow="Categorias"
  title="Serviços mais procurados"
  description="Escolha uma categoria para encontrar profissionais próximos."
  action={<LinkButton href="/categorias" variant="outline">Ver todas</LinkButton>}
/>
```

Diretrizes:

- use `eyebrow` para contexto curto;
- use `align="center"` em seções públicas de destaque;
- use `action` para CTA secundário relacionado à seção.

### `DashboardPanel`

Arquivo: `src/components/ui/dashboard-panel.tsx`

Composição de card para blocos de dashboard.

Exemplo:

```tsx
<DashboardPanel
  title="Disponibilidade"
  description="Controle como seu perfil aparece para clientes."
  action={<Button variant="outline">Editar</Button>}
>
  Conteúdo do painel
</DashboardPanel>
```

Diretrizes:

- use em painéis de cliente, profissional e admin;
- mantenha descrição objetiva;
- coloque ações no header quando afetarem todo o painel.

### `StatCard`

Arquivo: `src/components/ui/stat-card.tsx`

Usado para métricas e indicadores.

Exemplo:

```tsx
<StatCard
  label="Orçamentos"
  value="12"
  detail="Novos pedidos nos últimos 30 dias"
  icon={<MessageSquareText size={20} />}
/>
```

Diretrizes:

- valores devem ser curtos;
- detalhe deve explicar período ou contexto;
- ícone é opcional, mas deve reforçar a métrica.

### Componentes de layout

Arquivos principais:

- `src/components/layout/site-header.tsx`;
- `src/components/layout/mobile-nav.tsx`;
- `src/components/layout/site-footer.tsx`;
- `src/components/layout/dashboard-shell.tsx`;
- `src/components/layout/dashboard-nav.tsx`;
- `src/components/layout/header-auth-menu.tsx`;
- `src/components/layout/institutional-page.tsx`.

Diretrizes:

- header mantém altura `h-16`, superfície translúcida e borda inferior;
- navegação desktop usa links `text-sm font-bold`;
- mobile deve refletir os itens essenciais do contexto do usuário;
- dashboards usam shell e navegação lateral/topo padronizados.

### Componentes de marketplace

Arquivos principais:

- `worker-card.tsx`;
- `worker-profile.tsx`;
- `category-grid.tsx`;
- `search-panel.tsx`;
- `quote-request-panel.tsx`;
- `favorite-button.tsx`;
- `trust-badge.tsx`;
- `review-form.tsx`;
- `review-summary.tsx`;
- `contact-actions.tsx`;
- `lead-whatsapp-button.tsx`.

Diretrizes:

- cards de profissional devem exibir imagem, nome, profissão, sinais de confiança, serviços, avaliação, localização e CTAs;
- ações de contato e orçamento devem ser claras e próximas do contexto;
- avaliações usam estrela com `accent`;
- sinais de confiança devem combinar texto, cor e ícone.

## 5. Espaçamento e Layout

### Containers

Use `container-page` para largura máxima e padding horizontal consistente.

Definição:

```css
.container-page {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: 1rem;
}
```

Breakpoints:

- `sm`: padding horizontal `1.5rem`;
- `lg`: padding horizontal `2rem`.

Exemplo:

```tsx
<section className="section-y">
  <div className="container-page">
    <SectionHeader title="Profissionais em destaque" />
  </div>
</section>
```

### Seções

Use `section-y` para espaçamento vertical de seções públicas.

Definição:

```css
.section-y {
  padding-block: 3.5rem;
}

@media (min-width: 768px) {
  .section-y {
    padding-block: 4.5rem;
  }
}
```

### Grids

Use grids responsivos com mobile primeiro.

Exemplos:

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```

```tsx
<div className="grid gap-4 sm:grid-cols-2">
  <Field>...</Field>
  <Field>...</Field>
</div>
```

### Espaçamentos recomendados

| Contexto | Classes |
| --- | --- |
| Gap entre cards | `gap-5` ou `gap-6` |
| Padding de card | `p-5 sm:p-6` |
| Header de card | `px-5 py-4 sm:px-6` |
| Conteúdo de card | `p-5 sm:p-6` |
| Gap em formulário | `gap-4` |
| Gap em botões lado a lado | `gap-3` |
| Margem abaixo de section header | `mb-8` |
| Espaço entre parágrafos curtos | `mt-2` ou `mt-3` |
| Espaço antes de CTAs em cards | `mt-5` |

### Regras de layout

- Não use largura fixa quando uma restrição responsiva resolver.
- Use `min-w-0` em áreas com texto truncado dentro de flex/grid.
- Use `truncate` para nomes curtos em linhas únicas.
- Use `line-clamp-2` ou `line-clamp-3` em descrições de cards.
- CTAs em cards de mesma linha devem ficar alinhados no rodapé quando os cards têm alturas diferentes.
- Evite layout shift em botões, badges e áreas de imagem.

## 6. Iconografia

O projeto usa `lucide-react` como biblioteca de ícones.

Ícones recorrentes:

- `ShieldCheck`, `BadgeCheck`: confiança, verificação e segurança;
- `Star`: avaliações e destaque;
- `MapPin`: localização;
- `Search`, `SearchX`, `SlidersHorizontal`: busca e filtros;
- `Heart`: favoritos;
- `Phone`, `MessageCircle`, `Mail`: contato;
- `CalendarDays`, `Clock`, `TimerReset`: datas, prazo e tempo;
- `WalletCards`: plano, pagamento ou orçamento;
- `UserRound`, `Users`, `BriefcaseBusiness`: usuários e profissionais;
- `Bell`: notificações;
- `Eye`, `EyeOff`: visibilidade;
- `LoaderCircle`: carregamento;
- `CheckCircle2`, `XCircle`: sucesso e erro;
- `ArrowRight`, `ArrowLeft`, `ArrowUpDown`: navegação e ordenação;
- `Camera`, `Upload`, `RefreshCcw`: identidade, upload e revisão;
- `Trash2`, `Save`, `Plus`: ações de edição.

Exemplo:

```tsx
import { MapPin, Star } from "lucide-react";

<span className="flex items-center gap-2 text-sm text-muted">
  <Star className="fill-accent text-accent" size={16} />
  4,9 (57 avaliações)
</span>

<span className="flex items-center gap-2 text-sm text-muted">
  <MapPin size={16} />
  Vila Mariana, São Paulo
</span>
```

Diretrizes:

- use `size={16}` em metadados e listas;
- use `size={18}` ou `size={20}` em botões e headers compactos;
- use `size={24}` apenas em cards de métrica ou áreas de destaque;
- ícones decorativos devem ter contexto textual próximo;
- botões apenas com ícone devem usar `aria-label`;
- mantenha stroke padrão do Lucide, salvo casos como estrela preenchida para rating.

## 7. Acessibilidade

### Estrutura semântica

- Use `button` para ações e `Link` para navegação.
- Mantenha hierarquia de headings coerente.
- Use `label` associado ao campo por `htmlFor` e `id`.
- Não use `div` clicável quando `button` ou `a` resolver.

### Foco e teclado

- Todo elemento interativo deve ser acessível por teclado.
- Não remova outline sem fornecer foco visível.
- Use o padrão existente de foco: `focus:ring-2` em botões e `focus:ring-4 focus:ring-primary/15` em campos.
- Dropdowns, modais e autocompletes devem ser testados com teclado.

### Contraste

- Texto principal usa `foreground` sobre `background` ou `surface`.
- Texto secundário usa `muted` ou `muted-strong` apenas quando o contraste continuar suficiente.
- Não use `accent` como texto pequeno sobre fundo claro sem verificar contraste.
- Estados semânticos devem combinar cor com texto.

### Formulários

- Campos obrigatórios devem ser indicados no label ou no texto de apoio.
- Erros devem aparecer próximos ao campo e explicar como corrigir.
- Não dependa apenas de placeholder.
- Mensagens de sucesso e erro devem ser claras e persistir tempo suficiente para leitura.

### Imagens

- Imagens informativas devem ter `alt` descritivo.
- Imagens puramente decorativas podem usar `alt=""`.
- Fotos de profissionais devem usar nome ou contexto do profissional.
- Imagens de portfólio devem descrever o serviço ou resultado.

### Estados

Componentes devem cobrir:

- carregando;
- vazio;
- erro;
- sucesso;
- desabilitado;
- sem permissão;
- conteúdo truncado ou longo.

Exemplo de botão com carregamento:

```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Salvando..." : "Salvar"}
</Button>
```

### Texto e idioma

- O documento HTML usa `lang="pt-BR"`.
- Textos de interface devem estar em português claro.
- Evite jargões internos em telas públicas.
- Use termos consistentes: `profissional`, `cliente`, `orçamento`, `avaliações`, `verificação`, `plano`.

## Checklist para Novos Componentes

Antes de criar ou aprovar um componente, verifique:

- Usa tokens de cor existentes?
- Reutiliza `Button`, `Card`, `Badge`, `Field` ou outro componente base?
- Funciona em mobile e desktop?
- Tem foco visível?
- Usa elemento semântico correto?
- Estados de erro, vazio, carregamento e desabilitado foram considerados?
- Textos longos não quebram o layout?
- Ícones têm texto próximo ou `aria-label`?
- O componente pertence a `src/components/ui`, `src/components/layout`, `src/components/marketplace`, `src/components/dashboard` ou a um domínio em `src/features`?
