# RLS — padrões de policy e testes

## Padrões

```sql
-- 1. Owner-based (o caso comum)
alter table notes enable row level security;
create policy "owner lê"    on notes for select using (auth.uid() = user_id);
create policy "owner cria"  on notes for insert with check (auth.uid() = user_id);
create policy "owner edita" on notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- (sem policy de delete = ninguém deleta via API)

-- 2. Multi-tenant por membership
create policy "membro do tenant lê" on projects for select
using (tenant_id in (select tenant_id from memberships where user_id = auth.uid()));

-- 3. Papel via claim do JWT
create policy "admin do app lê tudo" on audit_log for select
using ((auth.jwt() ->> 'app_role') = 'admin');
```

## Regras de qualidade

1. **`using` controla o que vê; `with check` o que grava** — update precisa dos dois (senão o usuário "move" a linha para outro dono).
2. **Performance**: policy roda por linha — `auth.uid()` embrulhado em `(select auth.uid())` é cacheado pelo planner; subconsulta de membership merece índice (`memberships(user_id, tenant_id)`).
3. **Uma policy por operação e papel** — policy gigante com `OR` de todos os casos é ilegível e cara; nomeie cada uma pelo que permite.
4. **`service_role`/`sb_secret_` em policy não faz nada** — esse papel tem `BYPASSRLS`; não escreva policy "para o admin do servidor".
5. **View/function `security definer` fura a RLS** — audite-as; é o jeito "legítimo" de vazar dados sem querer.

## Teste de policy (obrigatório para cada tabela)

Em SQL (transação com rollback) ou no teste de integração:

```sql
begin;
  select set_config('request.jwt.claims', '{"sub":"<uuid-do-usuario-A>","role":"authenticated"}', true);
  set local role authenticated;
  -- deve ver só as próprias linhas:
  select count(*) from notes;              -- esperado: N do usuário A
  -- não deve conseguir gravar como outro dono:
  insert into notes (user_id, body) values ('<uuid-do-usuario-B>', 'x');  -- esperado: erro de with check
rollback;
```

Cubra sempre: anônimo (nada além do público), usuário A vs. dados do B (zero vazamento), e a operação de escrita com dono trocado (recusada).
