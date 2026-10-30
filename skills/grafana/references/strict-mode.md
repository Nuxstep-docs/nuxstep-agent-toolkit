# Modo Estrito — Grafana

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **UI de produção sem edição** — `allowUiUpdates: false` (ou Git Sync obrigatório); papel de editor em produção restrito; toda mudança é PR.
2. **Lista mestre com revisão periódica** — inventário dos dashboards aprovados, com dono; revisão trimestral remove órfãos e `TMP:` esquecidos; uso rastreado (analytics) embasa a remoção.
3. **Família de dashboards gerada por código** — a partir de ~3 dashboards com a mesma estrutura, migrar para Foundation SDK; cópia manual da família é achado de review.
4. **Mudança testada fora de produção** — instância de staging do Grafana (ou preview do Git Sync) valida o dashboard antes do merge.
5. **Alerta → dashboard obrigatório** — toda regra de alerta (Prometheus) referencia o dashboard RED correspondente nas annotations; alerta sem console é achado.
6. **Acesso com SSO e papéis mínimos** — viewer por default; service accounts com escopo por função e tokens rotacionados via cofre.
