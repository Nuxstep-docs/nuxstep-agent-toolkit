# Modo Estrito — Azure

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Azure Policy como guardrail** — tags obrigatórias, regiões permitidas e SKUs proibidos aplicados por policy (deny), não por convenção.
2. **Zero segredos em app settings** — tudo via Key Vault reference + Managed Identity; scan de segredos no CI.
3. **Rede privada por padrão** — VNet integration + Private Endpoints em TODOS os PaaS de produção; tráfego público só no edge (Front Door/App Gateway com WAF).
4. **Defender for Cloud ativo** com recomendações de severidade alta tratadas em cadência definida.
5. **DR documentado e ensaiado** — RTO/RPO definidos por sistema; restore/failover testado (backup nunca restaurado é hipótese).
6. **Revisão mensal de custo** — anomalias investigadas; recursos órfãos (sem tag de dono ou sem tráfego) removidos.
