# Tipos avançados — uso e limites

**Regra de ouro:** magia de tipos é custo de leitura. Use o recurso mais simples que expressa o contrato; um tipo que precisa de explicação para ser lido falhou o teste do clean-code.

## União discriminada + parse de borda (o padrão completo)

```ts
import { z } from 'zod';

const paymentEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('approved'), amount: z.number().positive(), paidAt: z.coerce.date() }),
  z.object({ type: z.literal('refused'), reason: z.string().min(1) }),
]);
type PaymentEvent = z.infer<typeof paymentEventSchema>; // tipo derivado do schema: fonte única

export function handleWebhook(body: unknown) {
  const event = paymentEventSchema.parse(body); // borda validada — daqui pra dentro o tipo é verdade
  switch (event.type) {
    case 'approved': return settle(event.amount, event.paidAt);
    case 'refused':  return notifyRefusal(event.reason);
    // sem default: se surgir um novo type, o compilador aponta os switches incompletos
  }
}
```

## Ferramentas na dose certa

- **Generics**: sempre com restrição (`<T extends { id: string }>`) e só quando há de fato mais de um tipo chamador; generic de um uso só é anotação disfarçada.
- **`satisfies`**: valida um literal contra um tipo SEM alargar a inferência — ideal para objetos de config (`const routes = {...} satisfies Record<string, Handler>`).
- **Mapped/conditional types**: ótimos para derivar (ex.: `Partial<Pick<T, K>>`), perigosos para inventar DSLs; se o tipo tem 3+ níveis de condicional, prefira duplicar duas interfaces simples.
- **Template literal types**: bons para contratos pequenos (`` `GET /${string}` ``); não reconstrua um parser no sistema de tipos.
- **`as const`**: para literais imutáveis que alimentam derivações (enum leve: `const ROLES = ['admin','user'] as const`).

## Sinais de alerta

- `as Tipo` em dado externo = cast mentiroso — troque por parse de schema.
- Dois `as unknown as X` encadeados = o modelo de tipos está errado; corrija o modelo.
- Tipo utilitário próprio reimplementando `Pick`/`Omit` = use o nativo.
