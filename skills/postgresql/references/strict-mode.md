# Modo Estrito — PostgreSQL

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Migration com lock-safety revisada** — checklist de migrations-safety.md aplicado em PR; `lock_timeout` obrigatório; migration arriscada exige plano de rollback escrito.
2. **Toda query de produção com plano conhecido** — endpoints críticos têm `EXPLAIN (ANALYZE, BUFFERS)` registrado no PR que os cria/altera.
3. **`statement_timeout` e `idle_in_transaction_session_timeout`** configurados por aplicação — sem query infinita nem transação zumbi.
4. **Observabilidade do banco** — `pg_stat_statements` ativo; top queries revisadas em cadência; alerta de bloat/vacuum atrasado.
5. **Acesso por papel mínimo** — app com role sem DDL; migrations com role próprio; superuser nunca em connection string de aplicação.
6. **Backup testado = backup** — restore ensaiado periodicamente (PITR configurado em produção); backup nunca restaurado é hipótese, não backup.
