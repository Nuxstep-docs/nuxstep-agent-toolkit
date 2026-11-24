# Dublês de teste — qual usar e quando

| Dublê | O que é | Use quando |
|---|---|---|
| **Dummy** | Preenche parâmetro, nunca é usado | A assinatura exige algo irrelevante ao teste |
| **Stub** | Resposta fixa programada | O teste precisa de um dado de entrada vindo da dependência |
| **Fake** | Implementação funcional simplificada (ex.: repositório em memória) | Vários testes usam a dependência com comportamento real — o fake do port é o dublê padrão no hexagonal |
| **Spy** | Grava as chamadas recebidas | Você precisa verificar que um efeito aconteceu (ex.: e-mail enviado) sem acoplar à implementação |
| **Mock** | Expectativas de interação pré-programadas que o próprio dublê verifica | O CONTRATO da interação é a regra de negócio (ordem, argumentos) — use com parcimônia |

## Regras práticas

1. **Dublê no port, não na lib** — crie a interface sua (`UserRepository`) e duble ela; nunca mocke `prisma`/`axios` diretamente: acopla o teste ao detalhe e quebra em upgrade.
2. **Fake em memória > mock de retorno** para repositórios: testes mais legíveis e resistentes a refactor.
3. **Um mock verificado por teste** — vários mocks com expectativas = teste frágil que testa a implementação.
4. **Integração real onde o dublê mente** — SQL, serialização e config não se provam com mock: use Testcontainers (ou equivalente) numa camada fina de testes de integração.

## Exemplo (Vitest, fake de port)

```ts
class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  async save(u: User) { this.users.push(u); }
  async findByEmail(email: string) { return this.users.find(u => u.email === email) ?? null; }
}

test('não cadastra dois usuários com o mesmo e-mail', async () => {
  const repo = new InMemoryUserRepository();
  const useCase = new RegisterUserUseCase(repo);

  await useCase.execute({ email: 'a@b.com', name: 'Ana' });

  await expect(useCase.execute({ email: 'a@b.com', name: 'Bia' }))
    .rejects.toThrow(EmailAlreadyInUseError);
});
```

Estado verificado via comportamento do use case (Chicago), dependência resolvida por fake do port — nenhum mock de framework.
