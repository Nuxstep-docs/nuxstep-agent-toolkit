# Modo Estrito — RabbitMQ

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Topologia declarada como código** — exchanges/filas/bindings/policies via definitions versionadas (ou IaC/operator), não criadas ad-hoc pelo client em produção.
2. **Teste de caos mínimo** — suíte que mata o consumidor no meio do processamento e prova: sem perda (ack manual) e sem efeito duplicado (idempotência).
3. **Outbox obrigatório** para todo evento originado de transação de banco; publicação direta na requisição é achado de review.
4. **Alertas obrigatórios**: profundidade de fila, DLQ > 0, consumidores = 0, memória/disco do broker em alarme.
5. **Contrato de mensagem versionado** — schema (JSON Schema/Avro) por evento com compatibilidade retroativa; breaking change = evento novo (`.v2`).
6. **DLQ com SLA de triagem** — mensagem na DLQ tem dono e prazo; reprocessamento documentado em runbook do projeto.
