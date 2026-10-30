# Modo Estrito — Redis

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Hit-rate monitorado com alvo** — cache sem métrica de hit/miss é fé; alvo definido por chave quente e alerta de degradação.
2. **Inventário de chaves** — padrões de chave documentados (prefixo, estrutura, TTL, dono) no repo; chave fora do inventário é achado de review.
3. **`maxmemory` + policy explícitos em TODA instância** — OOM do Redis derruba o que dependia dele.
4. **Timeout e circuit breaker no cliente** — Redis lento não pode travar a aplicação; fallback ao banco testado (teste de resiliência com o cache desligado).
5. **ACL por aplicação com comandos mínimos** — sem `FLUSHALL`/`CONFIG` para apps; `rename-command` ou ACL bloqueando comandos perigosos.
6. **Locks críticos fora do Redis** — correção que importa usa advisory lock do banco ou desenho idempotente (pack caching-patterns).
