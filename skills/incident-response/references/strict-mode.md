# Modo Estrito — Resposta a Incidentes

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Postmortem para todo SEV** — inclusive SEV3/4 (versão curta): a amostra pequena de incidentes graves esconde padrões que os pequenos revelam.
2. **On-call formal** — escala definida com horários, canal de acionamento e expectativa de resposta por SEV escritos; "liga pra quem estiver online" não é plano.
3. **Simulação periódica (game day)** — ao menos 1×/semestre: incidente simulado (restore de backup, rollback, perda de nó) com tempo medido; runbook que nunca rodou é hipótese.
4. **MTTA/MTTR medidos** — tempo até reconhecer e até resolver registrados por incidente e revisados por trimestre; a meta é tendência, não punição.
5. **Action items com gate** — item P0/P1 de postmortem entra no backlog com prazo; vencido sem justificativa bloqueia a retro seguinte.
6. **Status page/canal do cliente** — projeto com SLA tem canal formal de comunicação de incidente acordado em contrato (status page, e-mail, grupo), não mensagens ad hoc.
