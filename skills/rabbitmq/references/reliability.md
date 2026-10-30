# RabbitMQ — Confiabilidade de ponta a ponta

A pergunta que desenha tudo: **o que acontece se esta mensagem se perder? E se chegar duas vezes?** Responda as duas antes de codar.

## Transactional Outbox (publicação atômica com o banco)

Problema: salvar o pedido E publicar `order.created` não é atômico — commit sem publish (evento perdido) ou publish sem commit (evento mentiroso).

```
1. Na MESMA transação do negócio: INSERT INTO outbox (id, topic, payload, created_at)
2. Relay (job/CDC) lê a outbox, publica com publisher confirm, marca como enviada
3. Consumidores são idempotentes (o relay é at-least-once por natureza)
```

- Tabela outbox com índice em `(sent, created_at)`; limpeza das enviadas por retenção.
- O relay é o ÚNICO publicador desses eventos — o serviço nunca publica direto na requisição.

## Retry com backoff (sem plugin)

```
trabalho.fila            (consumo normal; nack sem requeue → DLX)
trabalho.retry.30s       (x-message-ttl: 30000; DLX de volta para trabalho.fila)
trabalho.retry.5m        (idem, 300000)
trabalho.dlq             (depois de N tentativas: estaciona + alerta)
```

Consumidor incrementa contador (header `x-retry-count`); ao estourar o teto, publica na DLQ com o erro anexado. DLQ tem dono: alerta + runbook de reprocessamento (inspecionar, corrigir causa, shovel de volta).

## Idempotência do consumidor

- Chave: id da mensagem (gerado na publicação) ou chave natural (`order_id` + tipo de evento).
- Guarde processados numa tabela/SET com unique constraint — o INSERT duplicado falhando É o dedupe.
- Efeitos externos não-idempotentes (e-mail, cobrança): verifique estado antes de repetir; na dúvida, prefira não-repetir + alerta.

## Checklist de um fluxo novo

- [ ] Quorum queue + mensagem persistente · [ ] publisher confirm (via outbox quando nasce de transação)
- [ ] DLX + cadeia de retry com teto · [ ] consumidor idempotente testado com duplicata (skill `tdd`)
- [ ] prefetch dimensionado · [ ] profundidade da fila e DLQ monitoradas com alerta
