# Modo Estrito — TypeScript

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **tsconfig além do strict** — habilitar também `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`.
2. **Lint com type-checking como gate** — `typescript-eslint` preset `strict-type-checked` + `stylistic-type-checked`; `@typescript-eslint/no-explicit-any: error`; regras `no-unsafe-*` ativas; CI falha com warning.
3. **`tsc --noEmit` no CI** — type-check completo como job obrigatório, separado do build do bundler (bundlers não checam tipos).
4. **Supressões justificadas e rastreadas** — `@ts-expect-error` (nunca `@ts-ignore`) com comentário do motivo; proibido `eslint-disable` de regra de segurança de tipos sem issue associada.
5. **Fronteiras com Result** — operações falíveis de domínio retornam união discriminada (`{ ok: true; value } | { ok: false; error }`) em vez de exceção, reservando `throw` para o inesperado.
6. **Imports de tipo explícitos** — `import type { ... }` para tudo que é só tipo (exigido por `verbatimModuleSyntax`), mantendo o grafo de runtime limpo.
