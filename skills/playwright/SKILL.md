---
name: playwright
description: >-
  Padrões da Nuxstep para Playwright em dois papéis: validação do resultado de
  desenvolvimento frontend pelo agente (abrir a página real, screenshot,
  console, interação — antes de reportar pronto) e testes e2e formais
  (@playwright/test com locators por papel). Use ao desenvolver/alterar
  qualquer UI web, escrever e2e, ou em pedidos como "testa se a tela funciona",
  "valida o fluxo de login", "por que o botão não aparece".
license: Proprietary
metadata:
  globs: "**/*.spec.ts,**/e2e/**,playwright.config.*"
  category: frontend
  visibility: "public"
---

# Playwright

Dois papéis distintos — não os confunda:

## 1. Validação de desenvolvimento (o agente VÊ o que construiu)

Mudou UI? **Nunca reporte "pronto" sem ter visto a página renderizada.** O ciclo mínimo, com o servidor de dev rodando:

1. Abra a rota afetada num browser real (Playwright MCP server — `@playwright/mcp` — quando o harness tiver; senão um script rápido `npx playwright`).
2. **Screenshot** da região alterada (desktop E mobile viewport) — confira contra o pedido.
3. **Console e requests**: zero erros de console; sem 4xx/5xx inesperado na aba de rede.
4. **Interação principal**: execute o fluxo que a mudança afeta (clique, submit) e confira o resultado visível.
5. Anexe a evidência ao relatório/PR (screenshot + saída do console).

Setup do MCP server e checklist completo: [agent-validation.md](references/agent-validation.md).

## 2. Testes e2e formais (`@playwright/test`)

1. **Fluxos críticos, não tudo** — e2e é o topo da pirâmide (login, ação principal, erro de contrato); o resto é unidade/componente (skill `tdd`).
2. **Locators por papel** — `getByRole('button', { name: /salvar/i })`, `getByLabel` — os mesmos da Testing Library: se não há role, a UI tem problema de acessibilidade.
3. **Auto-waiting, nunca sleep** — `await expect(locator).toBeVisible()` espera sozinho; `waitForTimeout` é flake agendado.
4. **Isolamento de dados** — cada teste cria o que precisa (API/fixture) e não depende de outro teste nem de estado do banco.
5. **Fixtures para autenticação** — `storageState` gerado uma vez por projeto de teste; login pela UI só no teste DO login.
6. **Trace ligado para falhas** — `trace: 'on-first-retry'`; depurar e2e sem trace é adivinhação.
7. **Paralelo por padrão** — testes que não podem rodar em paralelo estão acoplados; conserte o acoplamento.

## Não faça

- ❌ Reportar UI pronta sem abrir a página → ✅ screenshot + console (papel 1)
- ❌ `page.waitForTimeout(3000)` → ✅ `expect(...).toBeVisible()` (auto-wait)
- ❌ Seletor `.btn-primary > div:nth-child(2)` → ✅ `getByRole`/`getByLabel`/`getByTestId` (nesta ordem)
- ❌ e2e dependendo da ordem/estado de outro teste → ✅ cada teste cria seus dados
- ❌ Suíte e2e cobrindo cada detalhe → ✅ fluxos críticos; detalhe é teste de componente

## Quando ler o quê

- [agent-validation.md](references/agent-validation.md) — setup do Playwright MCP server no projeto e o checklist de validação visual do agente. Leia ao configurar o loop de validação ou validar uma entrega de UI.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
