# Padrões de cache

## Cache-aside (o default)

```
ler: GET chave → hit? retorna : (busca no banco → SET chave EX ttl → retorna)
escrever: atualiza o banco → DEL chave   (invalida; NÃO reescreve o cache na escrita)
```

- **Invalide por DEL, não por SET** na escrita: escrever o cache junto da escrita cria corrida entre dois writers; o próximo leitor repovoa.
- **TTL com jitter** (`ttl ± rand(10%)`) — mil chaves expirando no mesmo segundo = rajada no banco.
- **Negative caching** com TTL curto (30–60s) para "não existe" — evita martelar o banco com buscas de id inexistente.

## Stampede (dogpile)

Chave quente expira → N requests simultâneos vão ao banco. Proteções, da mais simples:

1. **Lock de repovoamento**: `SET lock:chave token NX EX 10` — só quem ganhou busca no banco; os demais usam o valor velho (se `stale-while-revalidate`) ou aguardam breve retry.
2. **Revalidação antecipada**: com TTL restante < X%, um leitor assíncrono repovoa antes de expirar.

## Write-through / write-behind

Só quando a leitura não pode tolerar miss (ex.: feed quente): escrita atualiza banco E cache na mesma operação (through) ou enfileira (behind — complexo, exige fila e idempotência; raramente vale).

## Lock distribuído — com cautela

- Lock simples de curta duração (evitar job duplicado): `SET lock NX EX` + token único + release por script Lua que confere o token. Suficiente para eficiência.
- **Correção crítica** (dinheiro, consistência): não dependa de Redlock — relógio/partição quebram a garantia (debate Kleinberg/antirez). Use lock no banco (advisory lock do Postgres) ou desenho idempotente.

## Checklist de implementação

- [ ] TTL definido e com jitter · [ ] invalidação mapeada para CADA escrita que afeta a chave
- [ ] estampede tratada nas chaves quentes · [ ] métrica de hit-rate exposta (skill `prometheus`)
- [ ] fallback: cache fora do ar = sistema degrada (vai ao banco), nunca cai
