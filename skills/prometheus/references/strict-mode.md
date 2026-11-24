# Modo Estrito — Prometheus

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **SLO formal com error budget** — SLIs declarados por serviço (latência/erro/disponibilidade) com objetivo numérico; paging por **burn rate multi-janela** (ex.: 14,4x/1h + 6x/6h), não por limiar fixo.
2. **Cardinalidade com gate** — orçamento de séries por serviço documentado; `promtool tsdb analyze` (ou limite no scrape: `sample_limit`/`label_limit`) verificado periodicamente; estouro abre issue.
3. **Regras validadas em CI** — `promtool check rules` + testes de regra (`promtool test rules`) para todo alerta novo; alerta sem teste é achado de review.
4. **Native histograms adotados** — onde o client da stack suporta, latência migra para native histogram com plano registrado; buckets fixos remanescentes justificados.
5. **Metamonitoramento obrigatório** — blackbox ponta a ponta do pipeline de alerta + verificador externo, ambos testados (simular a falha e ver a notificação chegar).
6. **Retenção e remote-write por ADR** — retenção local, downsampling/long-term storage (Thanos/Mimir/managed) e custo decididos em ADR, não por default.
