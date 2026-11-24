# NestJS — Testes

Método: skill `tdd` (red-green-refactor; Chicago no domínio, London nas bordas). Runner: Vitest (nativo na v12; Jest em legado).

## As três camadas

1. **Unidade (domínio e use cases) — sem Nest** — instancie o use case diretamente com fakes dos ports; `Test.createTestingModule` em teste de unidade é cerimônia que acopla ao framework e deixa a suíte lenta.

```ts
test('bloqueia e-mail duplicado', async () => {
  const useCase = new RegisterUserUseCase(new InMemoryUserRepository(), new FakeClock());
  await useCase.execute({ email: 'a@b.com' });
  await expect(useCase.execute({ email: 'a@b.com' })).rejects.toThrow(EmailAlreadyInUseError);
});
```

2. **Wiring (módulo)** — `Test.createTestingModule` só para provar que o módulo monta: providers resolvem, guards registrados. Poucos testes, um por módulo.

3. **e2e (borda)** — app real + `supertest`, banco real via **Testcontainers** (mock de banco não prova SQL nem constraint). `overrideProvider` apenas para terceiros externos (gateway de pagamento, e-mail).

## Regras

- Fake em memória do port > mock de método (skill `tdd`/test-doubles).
- e2e cobre o caminho feliz + os erros de contrato (400 de validação, 401/403, 409) de cada endpoint — é onde o `ValidationPipe` e os filters são provados.
- Sem `sleep` em teste: controle o tempo com `FakeClock`/timers do runner.
