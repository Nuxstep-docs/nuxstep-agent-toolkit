---
name: material-design
description: >-
  Padrões da Nuxstep para interfaces com Google Material Design 3: color roles
  com pares on-*, escala tipográfica, componentes do kit primeiro e tema por
  seed. Use ao construir UI Material — apps Android/Flutter (Material é o
  default) ou web com MUI — e em pedidos implícitos como "deixa com cara de
  app Android", "usa o tema Material", "qual cor uso aqui" nesses projetos.
license: Proprietary
metadata:
  globs: "**/*.dart,**/*.tsx,**/*.kt"
  category: frontend
  visibility: "public"
---

# Material Design 3

Padrões para projetos que adotam Material (Flutter e Android por padrão; web via MUI quando o produto pede essa linguagem). **Decisão por produto**: marca própria forte → design system próprio (skills `tailwindcss`/`html-css`); não force Material onde ele não é a identidade.

1. **Color roles, nunca hex** — o componente usa papéis (`primary`, `surface`, `error`, seus containers) vindos do tema; o tema nasce de um seed (`ColorScheme.fromSeed` no Flutter, theme do MUI). Rebrand = trocar o seed.
2. **Todo fundo tem seu par `on-*`** — texto sobre `primary` é `onPrimary`; sobre `surface`, `onSurface`. Os pares garantem contraste por construção — quebrar o par é quebrar a acessibilidade.
3. **Tipografia pela escala M3** — `display/headline/title/body/label` do tema; tamanho de fonte solto no componente é smell.
4. **Kit primeiro** — botões, cards, dialogs, navegação do framework Material (herdam estados, foco, semântica); componente custom só quando o kit comprovadamente não cobre.
5. **Estados pelo sistema** — state layers (hover/focus/pressed/disabled) e níveis de elevação do M3; sem box-shadow/opacity manuais.
6. **Motion do sistema** — easings e durações M3; respeite `prefers-reduced-motion`/configuração do SO.
7. **Dynamic color é opt-in consciente** — cor do wallpaper (Android 12+) só se a marca tolerar variação; senão, seed fixo.
8. **Tokens em camadas** — reference (paleta) → system (roles) → component; customização entra na camada certa, nunca sobrescrevendo o componente na unha.

**Acessibilidade e Core Web Vitals (web)**: os pares `on-*` cobrem contraste, mas semântica/foco/CWV seguem a skill `html-css` (pack `core-web-vitals.md`).

## Não faça

- ❌ `Color(0xFF...)`/hex direto no widget/componente → ✅ role do tema
- ❌ Texto com cor fixa sobre surface que muda (dark mode) → ✅ par `on-*`
- ❌ Reimplementar botão/dialog "igual ao Material" → ✅ componente do kit
- ❌ Misturar Material com outro design system na mesma tela → ✅ um sistema por produto
- ❌ Customizar componente sobrescrevendo estilo interno → ✅ customize pelo tema/tokens

## Quando ler o quê

- [theming.md](references/theming.md) — tema por seed na prática (Flutter e MUI), dark mode, camadas de token. Leia ao configurar o tema de um app Material.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
