# React — Hooks e Efeitos

## Preciso mesmo de um efeito?

Árvore de decisão antes de escrever `useEffect`:

1. **Transformar dados para exibir?** → calcule no render (variável normal; o Compiler memoiza).
2. **Reagir a um clique/submit/evento?** → código no handler do evento, não em efeito observando estado.
3. **"Resetar" estado quando uma prop muda?** → mude a `key` do componente (remonta limpo).
4. **Buscar dados?** → camada de dados (server component, TanStack Query) — elas tratam cache, corrida e cancelamento que o efeito manual não trata.
5. **Sincronizar com algo FORA do React** (subscription, DOM imperativo, analytics, timer)? → sim, `useEffect` — com cleanup simétrico ao setup, sempre.

`useEffectEvent` (19.2+): extrai a parte "sempre a versão mais recente" de um efeito sem colocá-la nas dependências — use para callbacks de log/analytics dentro de efeitos de subscription, em vez de desligar o lint de deps.

## Custom hooks bem desenhados

- Nomeie pela **capacidade** (`useCart`, `usePagination`), não pela mecânica (`useFetchAndSetState`).
- Retorne o mínimo: valor + ações nomeadas; evite devolver setters crus do `useState`.
- Um hook que só agrupa `useState`s sem comportamento é objeto — devolva um reducer ou divida.
- Hooks seguem as Rules of Hooks (topo do componente, sem condicional) — o lint `react-hooks` decide, não a intuição.

## Re-render: diagnóstico antes de remédio

1. Meça (React DevTools Profiler) — "parece lento" não é medição.
2. Causas comuns na ordem: estado alto demais na árvore (desça o estado), contexto gordo que muda sempre (fatie o contexto), lista sem virtualização (virtualize a partir de centenas de itens).
3. Só então memoização manual — e apenas se o projeto não tiver o React Compiler ativo.
