---
name: supabase
description: >-
  Padrões da Nuxstep para Supabase: RLS obrigatório em toda tabela, chaves
  publishable/secret no lugar certo, migrations pelo CLI (nunca dashboard em
  produção), Edge Functions para lógica server-side e tipos gerados. Use sempre
  que criar ou alterar projetos Supabase — tabelas, policies, auth, storage —
  também em pedidos implícitos como "guarda isso no banco do app", "protege
  esses dados por usuário" ou "o app está vendo dados de outro usuário".
license: Proprietary
metadata:
  globs: "**/supabase/**,**/migrations/*.sql"
  category: data
  visibility: "public"
---

# Supabase

Padrões para Supabase (versão/recursos vigentes: tool MCP `get_approved_stack`). **É Postgres**: a skill `postgresql` vale inteira (nomenclatura, constraints, índices, migrations). Papel na arquitetura: backend fino (auth + CRUD + storage + realtime) — quando a lógica de negócio cresce, o degrau seguinte é backend próprio (skill `software-architecture`, dose certa).

1. **RLS obrigatório em TODA tabela do schema exposto** — ative no `CREATE TABLE` (não "depois"); sem policy criada, nada é acessível (seguro por padrão); a proteção do client É a RLS.
2. **Chave certa no lugar certo** — `sb_publishable_` no client (pública por definição: roda como `anon`/`authenticated` e passa pela RLS); `sb_secret_` SÓ em servidor/Edge Function (**bypassa a RLS completamente** — no client é vazamento total). Migre as legadas `anon`/`service_role` (deprecadas até o fim de 2026).
3. **Schema nasce de migration no CLI** — `supabase migration new` + `supabase db push`; dashboard de produção é leitura/debug. Schema editado na UI = drift sem histórico.
4. **Policies são código revisado** — owner-based (`auth.uid() = user_id`), tenant-based, por papel via claims; cada policy com teste (pack [rls-patterns.md](references/rls-patterns.md)).
5. **Autorização de verdade não confia só no client** — regra crítica (pagamento, limite de plano) roda server-side: Edge Function (com validação de entrada — skill `typescript`, "parse don't cast") ou trigger/função SQL.
6. **Storage com policy** — bucket privado por padrão; URL assinada para acesso temporário; público só por decisão.
7. **Tipos gerados** — `supabase gen types typescript` no CI; client tipado de ponta a ponta, sem `any` nos dados.
8. **Dev local com o CLI** — `supabase start` + seed versionado; ninguém desenvolve apontando para produção.
9. **Consulta disciplinada** — colunas explícitas + `.range()`; `select('*')` sem limite em tabela que cresce é o mesmo erro de sempre.

## Não faça

- ❌ Tabela sem RLS "ativo depois" → ✅ RLS no CREATE, policies em seguida
- ❌ `sb_secret_`/`service_role` no frontend → ✅ só server-side (bypassa RLS!)
- ❌ Mexer no schema pelo dashboard de produção → ✅ migration via CLI
- ❌ Regra de negócio crítica só no client "porque tem RLS" → ✅ Edge Function/trigger valida no servidor
- ❌ Policy sem teste → ✅ teste como `anon` e como usuário de outro tenant

## Quando ler o quê

- [rls-patterns.md](references/rls-patterns.md) — policies padrão (owner, multi-tenant, papéis), performance de RLS e como testá-las. Leia ao modelar qualquer tabela exposta.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
