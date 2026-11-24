---
name: postgresql
description: >-
  Padrões corporativos da Nuxstep para PostgreSQL: nomenclatura snake_case,
  migrations obrigatórias e seguras, integridade por constraints, índices,
  paginação por cursor e uuidv7. Use sempre que modelar tabelas, escrever SQL,
  criar migrations, planejar índices ou configurar ORMs (Prisma, TypeORM,
  Hibernate) — também em pedidos implícitos como "crie a tabela de usuários",
  "essa query está lenta" ou "adicione uma coluna".
license: Proprietary
metadata:
  globs: "**/*.sql,**/prisma/schema.prisma,**/migrations/*,**/typeorm/*"
  category: data
  visibility: "public"
---

# PostgreSQL

Padrões de modelagem, migração e performance (versão vigente: tool MCP `get_approved_stack`; PG 18 é a linha atual).

1. **Nomenclatura estrita** — tabelas `snake_case` no plural (`orders`, `order_items`); colunas descritivas (`account_status`, não `status`); PK sempre `id`.
2. **Chave primária: `uuidv7()`** (nativo no PG 18) — ordenável por tempo, sem a fragmentação de índice do UUIDv4; `bigint identity` aceito em tabelas internas de altíssima inserção.
3. **Auditoria obrigatória** — `created_at` e `updated_at` como `timestamptz` em toda tabela; `deleted_at` (soft delete com filtragem ativa) nas tabelas cruciais de negócio.
4. **Migrations sempre** — proibido alterar schema à mão em produção ou `synchronize: true` de ORM; toda mudança é migration versionada (Flyway, Prisma Migrate...). Mudança em tabela grande segue [migrations-safety.md](references/migrations-safety.md).
5. **O banco protege a regra** — FKs, `UNIQUE`, `NOT NULL` e `CHECK` no schema; "a aplicação valida" não sobrevive ao segundo cliente do banco.
6. **Índice é decisão de escrita** — crie para toda FK e para os `WHERE`/`JOIN`/`ORDER BY` frequentes; justifique no texto da migration. Índice que nada consulta é custo puro de escrita.
7. **Paginação por cursor** — `OFFSET/LIMIT` degrada e pula registros em tabelas que crescem; use cursor (id/`created_at` indexado).
8. **N+1 é bug de desenho** — resolva com JOIN/eager loading deliberado ou dataloader; detectado por log de queries em dev.
9. **Query lenta se investiga com `EXPLAIN (ANALYZE, BUFFERS)`** — nunca adivinhe índice: meça, crie, meça de novo.
10. **Transação curta** — abra o mais tarde possível, feche o mais cedo possível; transação longa segura vacuum e locks.

## Não faça

- ❌ `ALTER TABLE` direto na produção "rapidinho" → ✅ migration versionada + janela/lock-safety
- ❌ UUIDv4 como PK por hábito → ✅ `uuidv7()` (ordenado por tempo)
- ❌ `timestamp` sem fuso → ✅ `timestamptz` sempre
- ❌ `SELECT *` em código de produção → ✅ colunas explícitas (contrato estável, menos I/O)
- ❌ Índice "preventivo" em toda coluna → ✅ índice guiado por query real + EXPLAIN

## Quando ler o quê

- [migrations-safety.md](references/migrations-safety.md) — mudanças sem derrubar produção: índice concorrente, `NOT NULL` em etapas, backfill em lotes, locks. Leia antes de QUALQUER migration em tabela grande/viva.
- [init.sql](references/init.sql) — blueprint de criação de tabela com nomenclatura, constraints e auditoria.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
