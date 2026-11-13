# NestJS — Persistência

Regras de modelagem/SQL: skill `postgresql` (ou `mysql`). Aqui, o encaixe no Nest.

1. **Repositório é um port** — interface no domínio (`UserRepository`), token no módulo, adapter com Prisma/TypeORM na infra. O use case não conhece o ORM (skill `software-architecture`).
2. **Entidade de domínio ≠ modelo do ORM** — mapeie no adapter; não deixe decorators do TypeORM/tipos do Prisma vazarem para o domínio.
3. **Transação como unidade de aplicação** — use case define o escopo transacional via port (`UnitOfWork`/`withTransaction`), nunca o controller; evite transação implícita atravessando requests.
4. **Migrations sempre** — `synchronize: true` proibido fora de teste descartável; migration versionada por mudança (skill `postgresql`).
5. **Paginação por cursor** nos endpoints de listagem que crescem; `limit` com teto no DTO.
6. **Pool e timeouts explícitos** — configure pool size e `statement_timeout` via config validada; conexão sem timeout é incidente à espera.

## Esqueleto do port + adapter (Prisma)

```ts
// domínio
export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}
export const USER_REPOSITORY = Symbol('UserRepository');

// infra (adapter)
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: Email) {
    const row = await this.prisma.user.findUnique({ where: { email: email.value } });
    return row ? UserMapper.toDomain(row) : null;
  }
  async save(user: User) {
    await this.prisma.user.upsert(UserMapper.toPersistence(user));
  }
}

// módulo
{ provide: USER_REPOSITORY, useClass: PrismaUserRepository }
```
