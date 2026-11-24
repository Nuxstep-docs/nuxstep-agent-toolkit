---
name: html-css
description: >-
  Padrões da Nuxstep para HTML semântico e CSS moderno: estrutura acessível,
  layout com grid/flex, tokens em custom properties, especificidade baixa e
  responsividade mobile-first. Use sempre que escrever ou alterar markup,
  estilos ou layout — em qualquer stack (sites, React, Next, WordPress) — e em
  pedidos implícitos como "monte essa página", "centraliza isso", "deixa
  responsivo", "o botão não parece clicável".
license: Proprietary
metadata:
  globs: "**/*.html,**/*.css,**/*.scss,**/*.tsx,**/*.jsx,**/*.vue,**/*.php"
  category: frontend
  visibility: "public"
---

# HTML & CSS

Regras essenciais — baratas até no site mais simples:

1. **Semântica primeiro** — `button` para ação, `a` para navegação, landmarks (`header`, `nav`, `main`, `footer`), headings em hierarquia (`h1`→`h2`, sem pular). Semântica correta é acessibilidade e SEO de graça.
2. **Acessibilidade de base** — `alt` em toda imagem com conteúdo (vazio se decorativa), `label` ligado a todo input, contraste 4.5:1 no texto, foco visível (`:focus-visible` estilizado — nunca `outline: none` sem substituto).
3. **ARIA é o último recurso** — nenhum ARIA é melhor que ARIA errado; só quando não existe elemento nativo para o papel.
4. **Layout é grid/flex** — grid para a página, flex para fileiras de itens, `gap` para espaçamento entre irmãos; floats e `position: absolute` para layout são legado.
5. **Tokens em custom properties** — cores, espaçamentos e fontes em `--vars` no `:root` (tema e dark mode trocam num lugar só).
6. **Mobile-first e unidades relativas** — estilos base para tela pequena + `@media (min-width)`; `rem` para fonte/espaçamento (respeita o zoom do usuário), `px` só para bordas/detalhes.
7. **Especificidade baixa e previsível** — classes, nunca `#id` em CSS; nesting com teto de ~3 níveis; `!important` proibido fora de utilitário declarado em cascade layer.
8. **Imagem responsável** — `srcset`/`sizes` (ou o componente do framework), `loading="lazy"` abaixo da dobra, dimensões declaradas (sem layout shift).
9. **Funciona antes do JS** — form com `action`, link com `href`; JS melhora, não sustenta, o básico.
10. **Respeite preferências do usuário** — `prefers-reduced-motion` em animações; `prefers-color-scheme` quando houver tema.

## Não faça

- ❌ `div`/`span` com `onClick` → ✅ `button` (teclado e leitor de tela de graça)
- ❌ ARIA para remendar div-soup → ✅ troque pelo elemento semântico
- ❌ `!important` para vencer especificidade → ✅ reduza a especificidade ou use cascade layers
- ❌ `font-size` em `px` → ✅ `rem`
- ❌ Esconder o foco do teclado → ✅ `:focus-visible` com estilo próprio
- ❌ Media query por dispositivo da moda → ✅ breakpoint onde o CONTEÚDO quebra

## Quando ler o quê

- [accessibility.md](references/accessibility.md) — checklist WCAG barato + padrões ARIA dos componentes comuns (modal, menu, tabs). Leia ao montar componentes interativos ou revisar acessibilidade.
- [modern-css.md](references/modern-css.md) — container queries, `:has()`, cascade layers, nesting: quando cada um vale a pena. Leia ao estruturar o CSS de um projeto ou componente reutilizável.
- [core-web-vitals.md](references/core-web-vitals.md) — LCP/INP/CLS: causas → correções e orçamento prático. Leia ao otimizar performance percebida ou quando o Search Console reclamar.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
