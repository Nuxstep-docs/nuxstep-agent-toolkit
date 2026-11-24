---
name: rabbitmq
description: >-
  Padrões da Nuxstep para RabbitMQ: quorum queues, publisher confirms,
  consumidor idempotente com ack manual, DLQ com retry/backoff e outbox
  pattern. Use sempre que implementar filas de trabalho, eventos entre
  serviços ou consumidores — também em pedidos implícitos como "processa isso
  em background", "a fila está acumulando" ou "a mensagem se perdeu".
license: Proprietary
metadata:
  globs: "**/rabbitmq/**,**/queues/**,**/consumers/**"
  category: messaging
  visibility: "public"
---

# RabbitMQ

Padrões para mensageria com RabbitMQ (versão vigente: tool MCP `get_approved_stack`). **Papel**: filas de trabalho e roteamento rico (exchanges); precisa de log de eventos com replay/retenção → skill `kafka`.

1. **Quorum queues para tudo que importa** — classic mirrored queues foram REMOVIDAS no 4.x; quorum é o mecanismo de durabilidade. Mensagem persistente + fila durável, ou assuma a perda por escrito.
2. **Publisher confirms** — publicar sem confirm é "fire and forget" de verdade: sem confirmação do broker, mensagem some em falha de rede sem ninguém saber.
3. **Entrega é at-least-once: consumidor IDEMPOTENTE** — duplicata vai acontecer; dedupe por id de mensagem/chave de negócio antes do efeito.
4. **Ack manual, depois de processar** — `autoAck` perde mensagem em crash do consumidor; ack só após o efeito persistido; `prefetch` dimensionado (1–50 conforme o custo da tarefa).
5. **DLQ + retry com backoff, sempre** — dead-letter exchange em toda fila; retry via fila de espera com TTL (backoff progressivo) e limite de tentativas; mensagem envenenada vai para a DLQ com alerta, nunca trava a fila em loop.
6. **Publicação atômica com o banco: outbox** — evento que nasce de transação de banco sai pelo transactional outbox (grava na mesma transação, relay publica), senão você publica o que não foi commitado (ou vice-versa). Pack [reliability.md](references/reliability.md).
7. **Exchange e nomes com padrão** — `topic` como default (`app.entidade.evento`, ex.: `loja.order.created`); filas nomeadas pelo consumidor (`notificacoes.order-created`).
8. **Conexão longa, canais por fluxo** — conexão AMQP por mensagem derruba o broker; client com reconexão automática e heartbeat.
9. **Fila com limite** — `max-length`/overflow policy definidos; fila crescendo sem teto é OOM do broker agendado; profundidade de fila monitorada com alerta (skill `prometheus`).
10. **Vhost e usuário por aplicação** — permissões mínimas, TLS, nunca o usuário `guest` fora do localhost.

## Não faça

- ❌ `autoAck: true` em trabalho que importa → ✅ ack manual pós-efeito
- ❌ Fila sem DLQ → ✅ dead-letter + retry com backoff e teto
- ❌ Consumidor assumindo entrega única → ✅ idempotência por id
- ❌ Publicar dentro da transação de banco sem outbox → ✅ transactional outbox
- ❌ Conexão nova por mensagem → ✅ conexão longa + canais

## Quando ler o quê

- [reliability.md](references/reliability.md) — confirms, retry/backoff com TTL, idempotência e o transactional outbox completo. Leia ao desenhar qualquer fluxo onde mensagem não pode se perder.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
