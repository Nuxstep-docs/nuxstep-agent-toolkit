# Flutter — Estado com Riverpod

## Escolha do provider

| Necessidade | Use |
|---|---|
| Valor derivado/configuração | `Provider` |
| Estado síncrono mutável | `NotifierProvider` |
| Dado assíncrono (API, banco) | `AsyncNotifierProvider` / `FutureProvider` |
| Stream (realtime) | `StreamProvider` |

Com codegen (`@riverpod`), prefira as versões geradas — menos boilerplate e tipos exatos.

## Padrões

1. **Provider é a casa do estado; widget só consome** — mutação acontece em métodos do Notifier, nunca `ref.read(...).state = x` espalhado pela UI.
2. **`select` para rebuild fino** — `ref.watch(cartProvider.select((c) => c.total))`: o widget só reconstrói quando o campo muda.
3. **AsyncValue renderiza os três estados** — `.when(data:, loading:, error:)`; erro mostra caminho de recuperação (retry), não tela branca.
4. **Invalidação explícita** — mutação que afeta outro provider chama `ref.invalidate(...)`; dependências implícitas via `watch` entre providers mantêm o grafo honesto.
5. **Repository entra por provider** — `repositoryProvider` fornece o port; troca por fake em teste é um `overrides: [...]`.

## Teste de provider (sem widget)

```dart
test('carrinho soma itens', () async {
  final container = ProviderContainer(overrides: [
    cartRepositoryProvider.overrideWithValue(InMemoryCartRepository()),
  ]);
  addTearDown(container.dispose);

  await container.read(cartProvider.notifier).add(productId: 'p1', qty: 2);

  expect(container.read(cartProvider).value?.items, hasLength(1));
});
```

Container puro, fake do port, verificação de estado — Chicago style (skill `tdd`), sem emulador.
