---
name: tailwindcss
description: >-
  Padrões da Nuxstep para TailwindCSS v4: tokens no @theme (config CSS-first),
  componentização em vez de @apply, classes estáticas detectáveis e ordem via
  formatter. Use sempre que estilizar com Tailwind — criar/alterar componentes,
  configurar tema, dark mode — também em pedidos implícitos como "estiliza esse
  card", "ajusta o espaçamento", "adiciona dark mode" em projetos com Tailwind.
license: Proprietary
metadata:
  globs: "**/*.tsx,**/*.jsx,**/*.html,**/*.css,**/*.vue,**/*.astro"
  category: frontend
  visibility: "public"
---

# TailwindCSS

Padrões para Tailwind v4+ (config CSS-first; versão vigente: tool MCP `get_approved_stack`). Semântica e acessibilidade continuam valendo — classes utilitárias não substituem a skill `html-css`.

1. **Tokens no `@theme`** — cores, espaçamentos e fontes do design viram tokens no CSS (`@theme { --color-brand: oklch(...); }`); sem `tailwind.config.js` em projeto novo (v4). Valor arbitrário (`[13px]`, `[#3b82f6]`) é exceção com justificativa, não hábito.
2. **Repetição vira componente, não `@apply`** — a unidade de reuso é o componente (React/partial/include); `@apply` fica para raríssimos casos de CSS que precisa existir como classe (ex.: conteúdo de CMS).
3. **Classe aparece inteira no fonte** — o scanner é estático: `bg-${color}-500` não existe no build. Condicional = mapa de classes completas + `clsx`/`cn()`.
4. **Ordem de classes é do formatter** — `prettier-plugin-tailwindcss`; ordem manual não se discute em review.
5. **Mobile-first com variantes** — base sem prefixo para mobile; `md:`/`lg:` para cima; estados com `hover:`/`focus-visible:`/`disabled:`; dark mode com `dark:` decidido nos tokens, não caso a caso.
6. **Semântico sobre literal** — `text-destructive`/`bg-surface` (tokens seus) em vez de `text-red-600` espalhado: trocar o tema não pode exigir find-replace.
7. **Um sistema por componente** — Tailwind OU CSS módulo; misturar os dois no mesmo componente sem razão documentada confunde a cascata.
8. **Customização pela porta certa** — utilitário novo com `@utility`, variante com `@custom-variant`, fontes extras de conteúdo com `@source`.

**Acessibilidade e Core Web Vitals**: utilitários não substituem as regras da skill `html-css` (semântica, foco visível, contraste dos tokens, pack `core-web-vitals.md`).

## Não faça

- ❌ `bg-${cor}-500` interpolado → ✅ mapa `{ danger: 'bg-red-500', ok: 'bg-green-500' }`
- ❌ `@apply` para "organizar classes" → ✅ extraia um componente
- ❌ `[valor-arbitrário]` espalhado → ✅ token no `@theme`
- ❌ `text-red-600` hardcoded para erro/estado → ✅ token semântico (`text-destructive`)
- ❌ Reordenar classes na mão → ✅ prettier-plugin-tailwindcss

## Quando ler o quê

- [theming.md](references/theming.md) — `@theme` na prática: tokens semânticos, dark mode, OKLCH, migração v3→v4. Leia ao configurar o tema de um projeto ou implantar dark mode.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
