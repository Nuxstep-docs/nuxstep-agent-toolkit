# Migrations seguras — mudar schema sem derrubar produção

Regra geral: em tabela pequena/fria, a migration simples basta. Em tabela **grande ou quente**, todo `ALTER` precisa da pergunta: *que lock isso pega, por quanto tempo?*

## Receitas lock-safe

| Mudança | Jeito perigoso | Jeito seguro |
|---|---|---|
| Índice novo | `CREATE INDEX` (bloqueia escrita) | `CREATE INDEX CONCURRENTLY` (fora de transação) |
| `NOT NULL` em coluna existente | `ALTER ... SET NOT NULL` direto (scan + lock) | 1) `ADD CONSTRAINT ... CHECK (col IS NOT NULL) NOT VALID` → 2) `VALIDATE CONSTRAINT` (sem lock de escrita) → 3) `SET NOT NULL` |
| Coluna nova com default | (PG moderno resolve: default não reescreve a tabela) | `ADD COLUMN ... DEFAULT ...` ok; evite default volátil |
| Backfill de dados | `UPDATE` da tabela inteira numa transação | Lotes (`WHERE id BETWEEN ...`) com pausa; fora da migration de schema |
| Renomear coluna/tabela em uso | rename direto (quebra o deploy anterior) | Expand/contract: criar novo → dual-write → migrar leitura → remover velho |
| FK em tabela grande | `ADD FOREIGN KEY` direto | `NOT VALID` → `VALIDATE CONSTRAINT` depois |
| Trocar tipo de coluna | `ALTER TYPE` (reescreve com lock) | Coluna nova + backfill em lotes + troca (expand/contract) |

## Regras

1. **`lock_timeout` na migration** (ex.: `SET lock_timeout = '5s'`) — melhor falhar e reagendar do que enfileirar a produção atrás de um lock.
2. **Uma mudança arriscada por migration** — rollback e diagnóstico simples.
3. **Expand/contract para tudo que o código antigo ainda lê** — o deploy N precisa conviver com o schema do N+1.
4. **Backfill não vai na migration de schema** — script/job separado, em lotes, monitorado e retomável.
5. **Teste a migration contra volume realista** (dump mascarado/Testcontainers com dados gerados) antes de produção, em projetos `strict`.
