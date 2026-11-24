---
name: kafka
description: >-
  Padrões da Nuxstep para Kafka e Redpanda (API-compatível): particionamento
  por chave de entidade, consumidores idempotentes, schema registry com
  compatibilidade, retenção por propósito e lag como métrica nº 1. Use sempre
  que desenhar tópicos, producers/consumers ou pipelines de eventos — também em
  pedidos implícitos como "publica esse evento", "o consumer está atrasado" ou
  "preciso reprocessar o histórico".
license: Proprietary
metadata:
  globs: "**/kafka/**,**/topics/**,**/consumers/**"
  category: messaging
  visibility: "public"
---

# Kafka (e Redpanda)

Padrões para streaming de eventos (versão vigente: tool MCP `get_approved_stack`; linha 4.x é KRaft-only — sem ZooKeeper). **Redpanda fala a mesma API** com operação mais simples (binário único) — a escolha é operacional, os padrões abaixo valem igual. **Papel**: log de eventos durável com replay/retenção e stream processing; fila de trabalho simples → skill `rabbitmq` (ou share groups — item 8 — se o cluster Kafka já existe).

1. **A chave da mensagem é decisão de arquitetura** — chave = identidade da entidade (`order_id`): garante ordem POR ENTIDADE e co-localiza seus eventos. Chave nula espalha round-robin (sem ordem nenhuma); chave de baixa cardinalidade cria partição quente.
2. **Ordem existe só DENTRO da partição** — qualquer desenho que assuma ordem global do tópico está errado; precisa de ordem entre entidades? repense o modelo.
3. **Partições dimensionadas com folga** — aumentar depois rebaralha as chaves (quebra a ordem histórica); comece com múltiplo razoável do paralelismo-alvo (ex.: 12) e documente.
4. **Producer seguro por padrão** — `acks=all` + idempotência ligada (default moderno) + retries; sem isso, duplica ou perde em failover.
5. **Consumidor idempotente, commit após processar** — at-least-once é o contrato real; dedupe por chave de negócio; auto-commit antes do efeito é perda silenciosa de mensagem.
6. **Schema registry desde o primeiro tópico** — Avro/Protobuf/JSON Schema com compatibilidade `BACKWARD`; breaking change = tópico novo (`.v2`), nunca mutação do contrato.
7. **Retenção pelo propósito** — eventos: retenção por tempo (defina! o default não é decisão); estado/último-valor: log compaction; tópico sem política declarada é disco infinito.
8. **Fila de trabalho no Kafka: share groups** (Queues for Kafka, produção desde 4.2) — consumo cooperativo sem amarrar partição a consumidor; use quando o cluster já é Kafka e o caso é fila, antes de adicionar um RabbitMQ só para isso.
9. **Lag é a métrica nº 1** — lag por consumer group exportado e alertado (skill `prometheus`); lag crescendo = consumidor doente ou subdimensionado.
10. **Outbox para publicação atômica com o banco** — mesmo padrão da skill `rabbitmq` (reliability.md): evento de transação sai pela outbox, nunca publish direto na requisição.

## Não faça

- ❌ Chave nula/aleatória esperando ordem → ✅ chave pela identidade da entidade
- ❌ Assumir ordem global do tópico → ✅ ordem é por partição
- ❌ Auto-commit antes de processar → ✅ efeito persistido, depois commit
- ❌ Evoluir schema sem registry/compatibilidade → ✅ BACKWARD ou tópico .v2
- ❌ Reprocessar (replay) sem idempotência no destino → ✅ dedupe testado antes do replay

## Quando ler o quê

- Skill `rabbitmq` → [reliability.md](../rabbitmq/references/reliability.md) — outbox, retries e idempotência valem aqui com a mesma mecânica.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
