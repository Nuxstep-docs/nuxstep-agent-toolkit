# Modo Estrito — Supabase

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Teste de RLS por tabela no CI** — suíte que roda as checagens do rls-patterns.md (anônimo, cross-tenant, escrita com dono trocado) contra o banco local do CLI; tabela nova sem teste de policy é devolução.
2. **`supabase db diff` limpo como gate** — drift entre migrations e o banco de produção falha o CI.
3. **Auditoria de `security definer`** — toda view/função assim listada e justificada no repo; criação nova é achado de review.
4. **Tipos gerados verificados no CI** — `supabase gen types` + diff vazio (schema e tipos sempre em sincronia).
5. **Chaves novas apenas** — legadas `anon`/`service_role` desativadas no projeto; rotação de `sb_secret_` documentada no runbook do projeto.
6. **Backups além do automático** — export agendado para storage próprio em produção (o PITR do plano tem retenção limitada; conheça-a).
