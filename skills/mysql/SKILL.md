---
name: mysql
description: >-
  Padrões da Nuxstep para MySQL: os princípios relacionais do playbook (nomenclatura,
  migrations, constraints) + as especificidades do MySQL — InnoDB, utf8mb4,
  DATETIME em UTC, online DDL com ALGORITHM explícito e lock_wait_timeout. Use
  sempre que modelar tabelas, escrever SQL, criar migrations ou investigar
  queries em projetos MySQL/MariaDB — também em pedidos implícitos como "cria a
  tabela", "essa query está lenta" ou "preciso alterar uma tabela grande".
license: Proprietary
metadata:
  globs: "**/*.sql,**/migrations/*,my.cnf"
  category: data
  visibility: "public"
---

# MySQL

**Os princípios da skill `postgresql` valem aqui** (nomenclatura snake_case/plural, migrations sempre, constraints no banco, índices justificados, paginação por cursor, transação curta, `SELECT *` proibido). Abaixo, o que é específico do MySQL (versão vigente: tool MCP `get_approved_stack`; 8.0 está EOL — mínimo 8.4 LTS).

1. **InnoDB, sempre** — MyISAM é legado sem transação/FK; não existe caso novo para ele.
2. **`utf8mb4` + collation moderna** (`utf8mb4_0900_ai_ci`) — o "utf8" do MySQL é de 3 bytes e corrompe emoji/caracteres fora do BMP.
3. **PK**: `BIGINT AUTO_INCREMENT` por padrão; UUID quando necessário em `BINARY(16)` com `UUID_TO_BIN(uuid, 1)` (swap de timestamp = índice ordenado) — nunca UUID em `CHAR(36)`.
4. **Datas em `DATETIME` com UTC na aplicação** — `TIMESTAMP` estoura em 2038 e depende do fuso da sessão; padronize `DATETIME(3)` + conversão na borda.
5. **SQL mode estrito é inegociável** — os defaults do 8.x (`STRICT_TRANS_TABLES`, `ONLY_FULL_GROUP_BY`) ficam LIGADOS; desligar para "parar o erro" esconde corrupção de dados.
6. **Online DDL com `ALGORITHM` explícito** — declare `ALGORITHM=INSTANT` (ou `INPLACE, LOCK=NONE` para índices): se a operação não suportar, o MySQL **erra em vez de degradar silenciosamente** para COPY com lock.
7. **`lock_wait_timeout` curto na migration** (ex.: 5s) — falhar e reagendar é melhor que enfileirar a produção atrás de um metadata lock.
8. **Tabela grande e viva**: mudança que não é INSTANT/INPLACE vai de `gh-ost`/`pt-online-schema-change` — a filosofia expand/contract da skill `postgresql` (migrations-safety) vale igual.
9. **`EXPLAIN ANALYZE`** (8.0.18+) para query lenta — meça, não adivinhe; índice novo nasce de plano lido.

## Não faça

- ❌ `utf8` (3 bytes) ou collation antiga → ✅ `utf8mb4` + `utf8mb4_0900_ai_ci`
- ❌ `TIMESTAMP` para datas de negócio/futuras → ✅ `DATETIME` + UTC na aplicação
- ❌ `ALTER TABLE` sem `ALGORITHM` em tabela grande → ✅ explícito, para falhar em vez de travar
- ❌ UUID em `CHAR(36)` como PK → ✅ `BINARY(16)` + `UUID_TO_BIN(..., 1)`
- ❌ Desligar `ONLY_FULL_GROUP_BY`/strict mode → ✅ corrija a query

## Quando ler o quê

- Skill `postgresql` → [migrations-safety.md](../postgresql/references/migrations-safety.md) — a filosofia de migração segura (expand/contract, backfill em lotes) vale para MySQL com as ferramentas daqui (item 8).
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
