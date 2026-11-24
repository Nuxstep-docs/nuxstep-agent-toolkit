---
name: prometheus
description: >-
  Padrões da Nuxstep para métricas com Prometheus: RED obrigatório, nomenclatura
  com namespace, cardinalidade sob controle, counter/gauge/histogram corretos e
  alertas por sintoma. Use ao instrumentar código com métricas, expor /metrics,
  escrever PromQL, criar recording rules ou regras de alerta — também em pedidos
  implícitos como "adicione métricas nesse serviço", "crie um alerta para isso",
  "como eu meço se está lento" ou "monitora esse job".
license: Proprietary
metadata:
  globs: "**/prometheus/**,**/*.yaml,**/*.yml"
  category: observability
  visibility: "public"
---

# Prometheus

Motor padrão de métricas do playbook (versão vigente: tool MCP `get_approved_stack`). Métrica responde "quanto/quão rápido, agregado"; o caso individual vai para log/trace — não misture os papéis.

1. **RED obrigatório em serviço online** — todo serviço expõe Rate, Errors e Duration em `/metrics` via client oficial da stack; as métricas default do runtime (Node/JVM) já vêm do client — nunca as redefina.
2. **Nomenclatura** — `<namespace>_<subsystem>_<nome>_<unidade>`: minúsculas com underscore, namespace do projeto no prefixo (ex.: `acme_app_...`), unidade base no sufixo (`_seconds`, `_bytes`; counter termina em `_total`). Dois-pontos são reservados a recording rules. Nunca gere parte do nome proceduralmente — variação é label, não nome (`http_responses_total{code="500"}`, jamais `http_responses_500_total`).
3. **Cardinalidade é o custo nº 1** — cada combinação de labels é uma série (RAM/disco/CPU), e labels multiplicam entre si. Label só com conjunto fechado e pequeno de valores (~10; acima de ~100, repense o design); **proibido** ID de usuário/transação ou valor aberto como label. Na dúvida, comece sem label.
4. **Tipo certo** — se o valor pode cair, é gauge; counter só sobe e se lê com `rate()` (nunca o valor cru, nunca `rate()` em gauge). Duração como gauge só em batch jobs e collectors.
5. **Histogram > summary** — histogramas agregam entre instâncias (`histogram_quantile` no servidor); summary não. Buckets desenhados em torno do SLO, não os defaults cegos.
6. **Batch job** — Pushgateway + timestamp Unix do último sucesso (consulta com `time() - métrica`; nunca "segundos desde" calculado na app, que congela se a app travar).
7. **Alerta por sintoma, com folga** — page só em dor do usuário (latência/erro na borda) e só onde há ação possível; causa (CPU, fila interna) é console/ticket, não page. Toda regra tem `for` e link para o console relevante.
8. **Métrica custa dinheiro** — antes de criar, pergunte que decisão ela informa; série que ninguém consulta é só custo.

## Não faça

- ❌ Label com ID/CEP/valor aberto → ✅ conjunto fechado (`status`, `provider`); o indivíduo vai para log/trace
- ❌ Uma métrica por variação (`..._500_total`) → ✅ uma métrica com label `code`
- ❌ Ler counter cru ou `rate()` em gauge → ✅ counter com `rate()`; gauge direto
- ❌ Page de CPU alta → ✅ sintoma do usuário com `for`, causa fica no console
- ❌ Summary para latência agregável → ✅ histogram + `histogram_quantile`
- ❌ Redefinir `http_requests_total` do framework → ✅ usar a default e nomear as suas com namespace

## Quando ler o quê

- [instrumentation.md](references/instrumentation.md) — instrumentar por tipo de serviço (online/offline/batch), subsistemas (cache, fila, falhas), valores iniciais, inner loops e exemplo padrão-ouro com `prom-client`.
- [alerting.md](references/alerting.md) — regras de alerta por tipo de sistema, recording rules, Alertmanager (grouping/severity) e metamonitoramento.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
