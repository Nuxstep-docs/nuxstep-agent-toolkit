---
name: redis
description: >-
  Padrões da Nuxstep para Redis (e Valkey, API-compatível): cache com TTL
  obrigatório, estruturas de dados certas, nomenclatura de chaves, SCAN em vez
  de KEYS e papel correto (nunca banco primário sem ADR). Use sempre que
  implementar cache, sessões, filas leves, rankings ou rate limit — também em
  pedidos implícitos como "cacheia essa consulta", "a sessão some", "monta um
  ranking" em projetos com Redis.
license: Proprietary
metadata:
  globs: "**/redis*,**/cache/**"
  category: data
  visibility: "public"
---

# Redis

Padrões para Redis/Valkey (versão vigente: tool MCP `get_approved_stack`). Papel na arquitetura: **dados voláteis e rápidos** — cache, sessão, contador, ranking, lock curto. A fonte de verdade é o banco relacional; Redis como banco primário exige ADR.

1. **TTL em tudo que é cache** — chave sem TTL precisa de justificativa escrita; instância de cache puro com `maxmemory` + `allkeys-lru` (eviction definida, não default).
2. **Nomenclatura de chaves**: `app:entidade:id[:sub]` (`loja:user:42:cart`) — prefixo da aplicação evita colisão e permite varredura administrativa por padrão.
3. **Estrutura certa, não string para tudo** — hash para objeto (campos acessáveis), zset para ranking/agenda, set para pertencimento, streams para eventos leves; JSON gigante numa string é o smell clássico.
4. **`KEYS` é proibido em produção** — bloqueia o servidor inteiro; use `SCAN` (iterativo). Operações O(N) em coleção grande (`SMEMBERS`, `LRANGE 0 -1`) têm o mesmo problema: pagine.
5. **Cache-aside com cabeça** — leia o pack [caching-patterns.md](references/caching-patterns.md) antes de implementar: invalidação deliberada, proteção contra stampede, TTL com jitter.
6. **Cliente reutilizado com timeouts** — conexão por request é vazamento; pool/singleton do client, `connect`/`command timeout` configurados.
7. **Nunca exposto** — rede privada, AUTH/ACL por aplicação (não o default user), TLS no gerenciado.
8. **Persistência conforme o papel** — cache puro: sem persistência; dado que dói perder: AOF `everysec` + réplica — ou repense se deveria estar no Redis.
9. **Atomicidade com comandos nativos** — `INCR`, `SETNX`, `EXPIRE` combinados ou script Lua curto; read-modify-write no cliente é race condition.

## Não faça

- ❌ `KEYS *` em produção → ✅ `SCAN` com padrão
- ❌ Cache sem TTL "para garantir" → ✅ TTL sempre + eviction policy
- ❌ Redis como fonte de verdade por conveniência → ✅ relacional + cache-aside (ou ADR)
- ❌ JSON blob gigante em `SET` → ✅ hash/estrutura adequada
- ❌ Read-modify-write no cliente → ✅ comando atômico/Lua

## Quando ler o quê

- [caching-patterns.md](references/caching-patterns.md) — cache-aside/write-through, invalidação, stampede, jitter, lock distribuído (e quando NÃO usar Redlock). Leia antes de implementar qualquer camada de cache.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
