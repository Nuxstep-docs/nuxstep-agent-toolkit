# Estrutura de projeto frontend (feature-first)

Materializa a regra "componente renderiza; lógica em hooks; dados em camada própria" em pastas. Vale para Next.js (App Router), Expo Router e SPA — muda o nome da pasta de rotas, não o desenho.

## A árvore

```
src/
├── app/                     # SÓ rotas (App Router/Expo Router): page/screen fina que
│   ├── (auth)/              #   compõe a feature; route groups p/ layouts distintos.
│   └── (app)/               #   Zero regra de negócio aqui.
├── features/                # O coração: uma pasta por domínio de negócio
│   └── checkout/
│       ├── components/      #   renderização DESTA feature (recebe props, emite eventos)
│       ├── hooks/           #   lógica/estado (useCheckout, useCartTotal) — testável sem UI
│       ├── schemas/         #   validação zod + tipos inferidos (z.infer) — borda valida aqui
│       ├── api.ts           #   chamadas desta feature (sobre o client de src/api)
│       └── index.ts         #   API pública da feature (o que o resto pode importar)
├── components/              # Compartilhados SÓ de apresentação (ui/, layout/, feedback/)
│   └── ui/                  #   sem fetch, sem regra de negócio, sem estado de domínio
├── api/                     # Client HTTP base + interceptors
│   ├── generated/           #   gerado do contrato OpenAPI (orval/openapi-ts) — NUNCA editado
│   └── mocks/               #   mocks do mesmo contrato p/ testes e dev offline
├── lib/                     # Utilitários puros cross-feature (format/, validation/)
├── config/                  # Env parseada e validada (zod) — import de process.env só aqui
├── i18n/                    # Textos (locales/pt-BR/...) — copy fora do componente
├── theme/                   # Tokens de design (skill ui-design/tailwindcss)
└── test/                    # Setup e utilities de teste compartilhados
```

## As regras que a árvore impõe

1. **Separação por papel dentro da feature** — `components/` renderiza, `hooks/` decide, `schemas/` valida, `api.ts` busca. Um arquivo fazendo dois papéis é o smell nº 1; o teste de cada papel é diferente (RTL / hook puro / parse de schema / mock de rede).
2. **Feature é módulo com porta** — o resto do app importa de `features/checkout` (o `index.ts`), nunca de um arquivo interno. Feature não importa de outra feature; o que duas features precisam desce para `lib/`, `components/` ou `api/`.
3. **Direção de dependência**: `app → features → (components | lib | api)` — nunca o contrário. `components/ui` não conhece feature nenhuma; `lib/` não importa React.
4. **Client de API nasce do contrato** — com OpenAPI disponível, o client é GERADO (categoria: gerador de client — orval, openapi-ts), com mocks derivados do mesmo contrato; `generated/` não se edita, se regenera. Sem contrato, o client manual vive em `api/` e as features o consomem — `fetch` solto em componente continua proibido.
5. **Zod na borda, tipo inferido dentro** — schema valida o que entra (form, resposta de API, env); o tipo TypeScript vem de `z.infer`, nunca duplicado à mão (skill `typescript`: parse, don't cast).
6. **Promoção por regra dos três** — componente nasce na feature; só sobe para `components/` compartilhado na terceira necessidade real (a abstração errada custa mais que a duplicação — skill `clean-code`).

## Quando NÃO usar o desenho completo

Dose certa (skill `software-architecture`): landing page/site simples não precisa de `features/` — `app/` + `components/` + `lib/` bastam. O desenho completo entra quando há domínio de negócio real (forms com validação, fluxos multi-tela, API própria). Subir de dose depois é barato se os papéis já estão separados dentro dos arquivos.
