---
name: react
description: >-
  Padrões da Nuxstep para componentes e hooks React: componentes funcionais,
  estado derivado em vez de duplicado, efeitos só para sincronização externa,
  memoização via React Compiler e testes por comportamento. Use sempre que
  criar ou alterar componentes, hooks ou lógica de UI em qualquer projeto React
  (incl. Next.js e React Native) — também em pedidos implícitos como "crie essa
  tela", "esse componente re-renderiza demais" ou "corrija esse bug de estado".
license: Proprietary
metadata:
  globs: "**/*.tsx,**/*.jsx"
  category: frontend
  visibility: "public"
---

# React

Padrões para UI React (versão vigente: tool MCP `get_approved_stack`). TypeScript strict por padrão (skill `typescript`).

1. **Funcional + hooks; classes proibidas** — exceção única: error boundary de lib.
2. **Componente renderiza; comportamento vive em custom hooks; dados vivem fora** — regra de UI em hooks (`useCart()`); acesso a dados numa camada própria (server components/route handlers no Next, TanStack Query em SPA) — nunca `fetch` solto dentro do componente.
3. **Derive, não duplique estado** — se dá para calcular no render a partir de props/estado existente, calcule; cada `useState` espelhando outro é um bug de sincronização agendado.
4. **Efeito é escotilha de emergência** — `useEffect` serve para sincronizar com sistema EXTERNO (DOM manual, subscription, analytics). Transformar dados, encadear estados ou "reagir" a prop no efeito é anti-padrão — calcule no render ou trate no evento.
5. **Imutabilidade no estado** — sempre produza novos objetos/arrays; mutação direta quebra a detecção de mudança.
6. **Memoização é trabalho do React Compiler** — `useMemo`/`useCallback`/`memo` manuais só em projeto sem Compiler e com gargalo medido; não polua o código preventivamente.
7. **Keys estáveis** — id do dado, nunca o índice quando a lista reordena/filtra.
8. **Erros com fronteira** — error boundary por região da UI (rota/painel) com fallback útil; falha de uma área não derruba a página.
9. **Acessível por construção** — elemento semântico certo (`button`, `label`+input), não `div onClick`; é também o que torna os testes por comportamento possíveis.

## Testes (TDD)

Vitest + React Testing Library + `user-event`: teste o comportamento pelo DOM acessível (`getByRole`), nunca detalhes internos do componente. Método na skill `tdd`; padrões em [testing.md](references/testing.md).

**Acessibilidade e Core Web Vitals**: valem as regras da skill `html-css` (semântica, pares de contraste, LCP/INP/CLS — pack `core-web-vitals.md`); INP é a métrica que o excesso de JS/hidratação derruba.

## Não faça

- ❌ `useEffect` para derivar/encadear estado → ✅ calcule no render ou mova para o handler do evento
- ❌ `fetch` direto no corpo do componente → ✅ camada de dados (Query/server component)
- ❌ `useMemo`/`useCallback` preventivos em tudo → ✅ React Compiler + medição
- ❌ Index como key em lista mutável → ✅ id estável do dado
- ❌ Prop drilling de 3+ níveis de um estado global → ✅ composição (children) ou store/context com critério

## Quando ler o quê

- [project-structure.md](references/project-structure.md) — estrutura feature-first (`features/<f>/{components,hooks,schemas,api}`), client gerado do contrato, direção de dependência e dose certa. Leia ao criar um projeto/feature ou quando a organização de pastas estiver em discussão.
- [hooks-and-effects.md](references/hooks-and-effects.md) — regras dos hooks, custom hooks bem desenhados, a árvore de decisão "preciso mesmo de um efeito?" e `useEffectEvent`. Leia ao criar hooks ou depurar efeitos/re-renders.
- [testing.md](references/testing.md) — padrões RTL: queries por role, user-event, fakes de rede. Leia ao testar componentes.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
