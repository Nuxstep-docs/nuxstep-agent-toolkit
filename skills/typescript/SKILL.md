---
name: typescript
description: >-
  Padrões da Nuxstep para TypeScript e JavaScript moderno: strict mode,
  validação de borda com schema, unknown em vez de any, unions discriminadas,
  inferência vs. anotação e tratamento de erros tipado. Use sempre que escrever
  ou alterar código .ts/.tsx/.js, configurar tsconfig, tipar dados externos ou
  corrigir erro de tipo — mesmo em pedidos genéricos como "crie essa função",
  "tipa isso aqui" ou "o build está reclamando de tipo".
license: Proprietary
metadata:
  globs: "**/*.ts,**/*.tsx,**/*.mts,**/*.js,**/*.jsx,tsconfig.json"
  category: language
  visibility: "public"
---

# TypeScript

Padrões para TypeScript — e para JavaScript moderno, que segue o mesmo espírito sem o compilador. Versão vigente da stack: consulte a tool MCP `get_approved_stack` (o TypeScript 7 trocou o compilador para o nativo em Go — confirme antes de configurar build).

1. **`strict: true` sempre** — todo o restante depende disso; projeto sem strict esconde `null`/`undefined` e anula o valor do TS.
2. **Borda valida com schema — "parse, don't cast"** — tipo não existe em runtime: toda entrada externa (HTTP, env, arquivo, mensagem) passa por schema (`zod`) antes de virar tipo; `z.unknown()` em vez de `z.any()`; decida explicitamente `strict()`/`strip()` para chaves excedentes.
3. **`unknown` em vez de `any`** — `unknown` força o narrowing; `any` desliga o compilador e contamina tudo que toca.
4. **Inferência nos locais, anotação nas fronteiras** — deixe o TS inferir variáveis locais; anote parâmetros e retornos de tudo que é exportado (contrato explícito e erros que apontam para o lugar certo).
5. **Estados ilegais irrepresentáveis** — modele variações com uniões discriminadas (`{ status: 'success'; data } | { status: 'error'; error }`), não com booleanos + campos opcionais que permitem combinações inválidas.
6. **Null-safety honesta** — `?.` e `??` para ausência esperada; `!` (non-null assertion) só com comentário justificando por que é impossível ser null.
7. **`const` por padrão, ESM, `async/await`** — sem `var`, sem cadeias `.then()` onde `await` cabe; erros de promise sempre tratados (sem floating promises).
8. **Derive, não duplique** — `Pick`/`Omit`/`Partial`/`ReturnType` e `satisfies` para derivar shapes de uma fonte única, em vez de interfaces copiadas que divergem.
9. **Erros tipados** — classes de erro próprias com `cause`; nunca `throw 'string'`; `catch (e)` trata `e` como `unknown` e faz narrowing.
10. **JavaScript puro** — quando TS não for opção, mesmo espírito via JSDoc types + `// @ts-check`; validação de borda continua obrigatória.

## Testes (TDD)

Runner padrão: **Vitest**. Siga a skill `tdd` (red-green-refactor; Chicago no domínio, dublês nos ports). Tipos não substituem testes: o compilador prova forma, não comportamento.

## Não faça

- ❌ `as Tipo` em dado externo (HTTP, env, JSON) → ✅ `schema.parse` na borda
- ❌ `any` para calar o compilador → ✅ `unknown` + narrowing
- ❌ `@ts-ignore` → ✅ corrija o tipo; impossível agora? `@ts-expect-error` com justificativa
- ❌ Interface "quase igual" copiada → ✅ derive com `Pick`/`Omit`/`z.infer`
- ❌ Promise sem `await`/tratamento (floating) → ✅ `await` + erro tratado ou propagado

## Quando ler o quê

- [advanced-types.md](references/advanced-types.md) — generics com restrição, mapped/conditional types, `satisfies`, união discriminada completa com parse de borda — e quando NÃO usar magia de tipos. Leia ao modelar tipos reutilizáveis ou revisar tipos complexos.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para projetos `Rigor do projeto: strict`.
