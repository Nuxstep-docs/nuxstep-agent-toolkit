---
name: nextjs
description: >-
  Padrões da Nuxstep para aplicações Next.js (App Router): Server Components
  por padrão, dados e mutações no servidor (Server Actions validadas), cache
  explícito, segredos server-only e estado de UI enxuto. Use sempre que criar
  ou alterar páginas, rotas, layouts, data fetching ou estratégias de
  renderização/cache em projetos Next — também em pedidos implícitos como
  "crie a tela de login", "adicione uma página", "isso está lento no servidor".
license: Proprietary
metadata:
  globs: "**/*.tsx,**/*.ts,next.config.js,next.config.ts"
  category: frontend
  visibility: "public"
---

# Next.js

Padrões para Next.js com App Router (versão vigente: tool MCP `get_approved_stack`; a v16 tornou o cache opt-in e o Turbopack padrão). Componentes seguem a skill `react`; tipos, a skill `typescript`.

1. **App Router obrigatório** — `app/`; Pages Router é legado, sem código novo.
2. **Server Components por padrão** — `'use client'` apenas nas folhas que precisam de interatividade; marcar uma página inteira como client joga fora o modelo.
3. **Dados nascem no servidor** — fetch em Server Components/route handlers; client component não busca dado inicial com `useEffect`.
4. **Mutação = Server Action com borda dura** — toda action valida entrada com schema (zod) e **re-verifica autenticação/autorização dentro dela** (a action é um endpoint público; o botão escondido não protege nada).
5. **Cache declarado, nunca acidental** — tudo é dinâmico por padrão (v16); cachear é decisão explícita (`'use cache'`/revalidate) com dono e prazo. Detalhes em [data-and-cache.md](references/data-and-cache.md).
6. **Segredo é server-only** — `NEXT_PUBLIC_` só para o que PODE vazar; módulos com segredos importam `server-only` para quebrar o build se um client importar.
7. **UI por segmento** — `layout.tsx` para o que persiste, `loading.tsx` (Suspense) e `error.tsx` (boundary) em todo segmento com dados.
8. **Assets pelo framework** — `next/image` e `next/font` sempre; `<img>` cru só com justificativa.
9. **Estado global de UI: Zustand, pequeno** — estado de servidor fica no servidor (cache do framework), nunca copiado para store.

## Testes (TDD)

Componentes: skill `react` (Vitest + RTL). Fluxos de rota/Server Actions: e2e com Playwright nos caminhos críticos. Método: skill `tdd`.

**Acessibilidade e Core Web Vitals**: regras da skill `html-css` (+ pack `core-web-vitals.md`); no Next, LCP se ganha com Server Components + `next/image`/`next/font`, e INP com menos JS no cliente.

## Não faça

- ❌ `'use client'` no topo da página toda → ✅ empurre para as folhas interativas
- ❌ Server Action confiando no client ("só chamo logado") → ✅ valida + autoriza dentro da action
- ❌ Segredo em `NEXT_PUBLIC_*` → ✅ env server-only + pacote `server-only`
- ❌ `useEffect` + fetch para dado inicial → ✅ Server Component
- ❌ Copiar resposta do servidor para store global → ✅ props/cache do framework

## Quando ler o quê

- [data-and-cache.md](references/data-and-cache.md) — o modelo de cache explícito (v16): `'use cache'`, revalidate, tags, o que roda onde, streaming/PPR. Leia ao decidir estratégia de dados/cache ou investigar página lenta/stale.
- Estrutura de pastas (feature-first; `app/` só com rotas finas): pack [project-structure.md](../react/references/project-structure.md) da skill `react` — o desenho é o mesmo, com Server Components fazendo o papel de dados.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
