# React — Testes de componente

Runner: Vitest + React Testing Library + `@testing-library/user-event`. Método: skill `tdd`.

## Regras

1. **Query por role primeiro** — `getByRole('button', { name: /salvar/i })`; se não há role acessível, o componente tem problema de acessibilidade, não o teste. `getByTestId` é último recurso.
2. **`user-event`, não `fireEvent`** — simula a interação real (foco, teclado, pointer) e pega bugs que `fireEvent` esconde.
3. **Rede com fake na borda** — MSW (ou fake do client da camada de dados); nunca mock de `fetch` global espalhado por teste.
4. **Assíncrono com `findBy*`/`await`** — nada de `waitFor` com corpo vazio nem `setTimeout`.
5. **Um comportamento por teste** — "mostra erro quando o e-mail é inválido", não "testa o formulário".

## Exemplo

```tsx
test('mostra erro quando o e-mail é inválido', async () => {
  const user = userEvent.setup();
  render(<SignupForm onSubmit={vi.fn()} />);

  await user.type(screen.getByRole('textbox', { name: /e-mail/i }), 'invalido');
  await user.click(screen.getByRole('button', { name: /cadastrar/i }));

  expect(await screen.findByText(/e-mail inválido/i)).toBeVisible();
});
```

Comportamento observável pelo DOM acessível; nenhum acesso a estado interno, nenhum snapshot gigante.
