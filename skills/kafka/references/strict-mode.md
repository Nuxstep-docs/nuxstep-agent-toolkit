# Modo Estrito — Kafka

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Tópicos como código** — criação/config (partições, retenção, compaction) via IaC/GitOps (Terraform provider, operator); `auto.create.topics` desligado.
2. **Schema registry obrigatório com compatibilidade enforced** — produção recusa schema não registrado; mudança de compatibilidade é PR revisado.
3. **ACLs por aplicação** — cada serviço com principal próprio, autorizado só nos seus tópicos/groups; TLS/SASL em tudo.
4. **Alertas obrigatórios**: lag por group com threshold, under-replicated partitions, disco do broker, consumidores = 0.
5. **Replay documentado** — todo tópico com runbook de reprocessamento (de onde resetar offset, idempotência do destino comprovada).
6. **Teste de contrato no CI** — producer e consumer validados contra o schema do registry (compatibilidade quebrada falha o build).
