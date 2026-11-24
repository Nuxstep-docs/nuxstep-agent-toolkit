# Next.js — Dados e Cache (modelo explícito, v16+)

Princípio: **dinâmico por padrão; cache é contrato declarado** — com escopo, prazo e forma de invalidar. Cache que ninguém declarou é bug de stale data esperando acontecer.

## Decisão rápida

| Dado | Estratégia |
|---|---|
| Por usuário / sensível | Dinâmico (padrão) — sem cache compartilhado, nunca `'use cache'` com dado de sessão |
| Público e estável (catálogo, CMS) | `'use cache'` na função/componente + `cacheLife` adequado |
| Público que muda por evento (preço, estoque) | `'use cache'` + `cacheTag` → `revalidateTag` na mutação |
| Misto na mesma página | Divida: casca cacheada + ilhas dinâmicas em `<Suspense>` (streaming/PPR) |

## Padrões

1. **Habilite por projeto** — `cacheComponents: true` no `next.config.ts`; a partir daí, `'use cache'` marca função/componente/arquivo cacheável.
2. **Invalidação na mutação** — toda Server Action que altera dado chama `revalidateTag`/`revalidatePath` dos caches afetados; mutação sem invalidação declarada é code smell revisável.
3. **Duplicação de fetch é ok no mesmo request** — o framework deduplica; não crie "camada de cache" caseira por cima.
4. **Route handler ≠ página** — API para terceiros/webhooks em `route.ts`; página busca direto no Server Component (sem chamar a própria API via HTTP).
5. **Server Action segura (o blueprint)**:

```ts
'use server';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

const schema = z.object({ productId: z.string().uuid(), qty: z.number().int().min(1).max(99) });

export async function addToCart(raw: unknown) {
  const session = await requireSession();            // autoriza DENTRO da action
  const { productId, qty } = schema.parse(raw);      // valida DENTRO da action
  await cartService.add(session.userId, productId, qty);
  revalidateTag(`cart-${session.userId}`);           // invalida o que mudou
}
```

## Sinais de alerta

- Página "às vezes mostra dado velho" → procure cache sem tag/prazo declarado.
- `'use cache'` em função que lê `cookies()`/sessão → vazamento entre usuários; remova.
- Build caiu de dinâmico para estático sem ninguém pedir → alguém cacheou a casca inteira por engano.
