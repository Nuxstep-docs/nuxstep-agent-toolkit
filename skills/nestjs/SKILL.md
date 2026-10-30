---
name: nestjs
description: >-
  Padrões corporativos da Nuxstep para APIs e microsserviços Node.js com
  NestJS: módulos por domínio, DI por tokens, validação de borda, erros RFC
  7807, config tipada, observabilidade e testes. Use sempre que criar ou
  alterar código NestJS — módulos, controllers, providers, DTOs, guards,
  interceptors — ou em pedidos implícitos num projeto Nest como "crie um
  endpoint", "adicione um CRUD", "proteja essa rota", "conecte no banco".
license: Proprietary
metadata:
  globs: "**/*.ts,nest-cli.json,tsconfig.json"
  category: backend
  visibility: "public"
---

# NestJS

Usamos o NestJS em capacidade máxima, com o domínio protegido do framework (skill `software-architecture` — hexagonal; skill `typescript` — strict). Versão vigente: tool MCP `get_approved_stack` (a v12 migrou para ESM — confirme antes de configurar build).

1. **Módulos por domínio (bounded contexts)** — cada feature num módulo isolado que exporta só o necessário; scaffold com `nest g res <nome>`. Módulo "gigante" ou import para pegar provider interno de outro módulo é fronteira quebrada.
2. **Controller magro** — traduz HTTP ↔ aplicação e nada mais; regra de negócio vive no use case/service. Controller nunca toca ORM.
3. **DI por tokens** — o TS apaga interfaces em runtime: injete abstrações por token (`Symbol`/string) definido no provider (`@Inject(USER_REPOSITORY)`); é isso que mantém o port trocável.
4. **Borda validada** — `ValidationPipe` global estrita (`whitelist`, `transform`) com DTOs `class-validator` — ou schemas zod via Standard Schema (v12+). Payload sem validação não entra.
5. **Erros em RFC 7807** — exception filters mapeiam erros de domínio → Problem Details; `HttpException` só nas bordas (o domínio lança erros próprios, sem saber de HTTP).
6. **Config tipada e validada na subida** — `ConfigModule` com schema (zod/joi) para env; a aplicação recusa subir com config inválida. Nunca `process.env` solto.
7. **Observabilidade** — interceptor global de logging JSON com `traceId` e duração (RED); métricas conforme skill `prometheus`.
8. **Resiliência HTTP externa** — timeout e retry/circuit em toda chamada a terceiros, no client do módulo.
9. **Fastify** para alta concorrência (em vez de Express), decidido por medição.

## Testes (TDD)

Siga a skill `tdd`: use case testado **puro** (instancie com fakes dos ports — sem `Test.createTestingModule` em unidade); o módulo de teste do Nest fica para wiring e e2e. Runner: Vitest (nativo na v12; Jest em legado). Detalhes em [testing.md](references/testing.md).

## Não faça

- ❌ Regra de negócio no controller ou no DTO → ✅ use case/entidade
- ❌ `@InjectRepository`/`prisma.*` dentro do use case → ✅ port + token + adapter
- ❌ `forwardRef` para resolver ciclo → ✅ repense as fronteiras; extraia o que é comum
- ❌ `process.env.X` espalhado → ✅ ConfigService tipado validado
- ❌ Exceção de domínio herdando `HttpException` → ✅ erro próprio + exception filter traduz

## Quando ler o quê

- [auth.md](references/auth.md) — autenticação e autorização: guards, JWT + refresh, RBAC, hashing, rate limit. Leia ao criar login, proteger rotas ou modelar permissões.
- [database.md](references/database.md) — persistência atrás de port: repositórios, transações, migrations, paginação. Leia ao conectar banco ou criar repositórios.
- [testing.md](references/testing.md) — unidade pura vs. módulo de teste, e2e com Testcontainers. Leia ao escrever testes Nest.
- [user.module.ts](references/user.module.ts) — blueprint de feature module isolado.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
