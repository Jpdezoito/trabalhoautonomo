# Design System

## Estrategia visual

O visual da AutonomoPro usa uma base premium, clara e funcional: superficies quentes, texto em alto contraste, acoes principais em verde-petroleo, destaque em amarelo-dourado e estados com cores semanticas. A interface deve parecer confiavel para servicos locais sem perder organizacao de plataforma profissional.

## Tokens principais

- `background`: fundo geral da aplicacao.
- `surface`: paineis, formularios e cards.
- `surface-muted`: areas secundarias e blocos internos.
- `foreground`: texto principal.
- `muted`: textos auxiliares.
- `primary`: acoes principais.
- `accent`: chamadas secundarias e destaques.
- `success`, `warning`, `danger`, `info`: estados.
- `border`: divisorias e bordas.

## Componentes base

- `Button`: variantes `primary`, `secondary`, `outline`, `ghost`, `danger`, `subtle`.
- `Badge`: variantes `neutral`, `primary`, `success`, `warning`, `danger`, `info`.
- `Card`: variantes `default`, `elevated`, `muted`, `interactive`.
- `Form`: `Field`, `Label`, `Input`, `Select`, `Textarea`, `FieldHint`, `FieldError`.
- `SectionHeader`: cabecalho consistente para secoes publicas e dashboards.
- `DashboardPanel`: painel padrao para blocos administrativos.
- `Dropdown`: base visual para menus.
- `Modal`: base visual para dialogs.

## Regras de layout

- Usar `container-page` para largura maxima consistente.
- Usar `section-y` para espacamento vertical de secoes.
- Cards devem manter raio de `8px`.
- Formularios devem usar labels acima dos campos.
- Dashboards devem priorizar cards, tabelas legiveis e estados claros.
- Mobile primeiro: grids devem colapsar para uma coluna antes de expandir em `sm`, `md` ou `lg`.
