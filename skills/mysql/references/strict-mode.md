# Modo Estrito — MySQL

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Migration de tabela grande com plano de lock escrito no PR** — algoritmo declarado, estimativa de duração, janela e rollback; `gh-ost`/`pt-osc` obrigatório quando não é INSTANT/INPLACE.
2. **`EXPLAIN ANALYZE` registrado** no PR para toda query nova em endpoint crítico.
3. **Timeouts por aplicação** — `max_execution_time` (leitura) e `lock_wait_timeout` configurados; transação zumbi é incidente.
4. **Observabilidade** — slow query log ativo com threshold definido e revisão em cadência; `performance_schema` ligado.
5. **Acesso por papel mínimo** — app sem DDL; migrations com usuário próprio; root nunca em connection string.
6. **Backup com restore ensaiado** (dump lógico + binlog para PITR em produção); replicação monitorada (lag alertado).
