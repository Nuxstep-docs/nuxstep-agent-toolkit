# NestJS — Autenticação e Autorização

## Arquitetura

- **Guard autentica, policy autoriza, use case decide** — `AuthGuard` valida o token e popula `request.user`; autorização por role/permissão em guard dedicado (`RolesGuard` + decorator `@Roles(...)`); regra de negócio sensível a dono do recurso fica no use case (guard não conhece domínio).
- Auth é um **módulo próprio** (`AuthModule`) exportando só o guard e o serviço de tokens.

## Padrões obrigatórios

1. **Access token curto (≤15 min) + refresh token rotativo** — refresh persistido com hash e revogável; rotação invalida o anterior (detecção de replay).
2. **Senhas com argon2id** (ou bcrypt ≥12 rounds em legado) — nunca hash caseiro; comparação sempre pela lib.
3. **Rate limit no login e no refresh** — `@nestjs/throttler` por IP+conta; resposta de erro idêntica para usuário inexistente e senha errada.
4. **Segredos via config validada** — chave JWT do `ConfigService`; algoritmo fixado (`RS256`/`EdDSA` em produção multi-serviço; `HS256` aceitável em monolito) e `aud`/`iss` verificados.
5. **Rotas públicas são exceção explícita** — guard global + decorator `@Public()`; o padrão é protegido.

## Esqueleto mínimo

```ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenService, private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()])) return true;
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (!token) throw new UnauthorizedException();
    req.user = await this.tokens.verify(token); // lança se inválido/expirado
    return true;
  }
}
```

`TokenService` é um port do módulo de auth — o adapter usa `@nestjs/jwt`/`jose`; use cases nunca importam a lib de JWT.
