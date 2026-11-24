# Modo Estrito — Vercel

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Deployment protection em todos os previews** (SSO/senha) — preview público só com decisão registrada.
2. **Checks obrigatórios antes do deploy de produção** — CI verde + e2e do preview aprovado (integração GitHub checks) como gate do merge.
3. **Observabilidade exportada** — logs/metrics drenados para o stack do projeto (não só o painel da Vercel); Web Vitals de produção acompanhados (skill `html-css`/CWV).
4. **Limite de gasto hard + revisão mensal de fatura** por projeto; anomalia de bandwidth investigada (pode ser abuse).
5. **Env vars auditadas** — inventário com dono; rotação documentada; nenhum segredo compartilhado entre Preview e Production.
