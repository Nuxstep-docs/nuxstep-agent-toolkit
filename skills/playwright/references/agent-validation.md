# Validação visual pelo agente — setup e checklist

## Setup por projeto (uma vez)

O caminho portátil entre harnesses é o **Playwright MCP server** oficial, no `.mcp.json` do projeto:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

Com ele, o agente navega, clica, lê o console e tira screenshots por tools MCP — em qualquer cliente MCP. Alternativa sem MCP: script descartável com `npx playwright` (`chromium.launch()` + `page.goto` + `page.screenshot`), ou as ferramentas de browser nativas do harness quando existirem.

## Checklist de validação de uma entrega de UI

Com o dev server rodando (`npm run dev` ou equivalente):

1. **Renderização** — rota afetada aberta; screenshot em viewport desktop (1280px) e mobile (375px). Compare com o pedido/design: layout, textos, estados visíveis.
2. **Console limpo** — nenhum erro; warnings novos investigados (hidratação no Next, keys no React aparecem aqui).
3. **Rede** — sem 4xx/5xx inesperado; sem request para endpoint inexistente.
4. **Interação principal** — execute o fluxo da mudança (preencher, clicar, submeter) e confira o resultado observável (mensagem, navegação, item na lista).
5. **Estados não-felizes rápidos** — campo vazio/inválido mostra o erro esperado? Loading aparece?
6. **Teclado** — o fluxo fecha só com Tab/Enter? (pega regressão de acessibilidade barata)

## Evidência no relatório

Cole no PR/relatório: screenshot(s), uma linha sobre console/rede ("console limpo, 0 erros") e o fluxo interagido. **Entrega de UI sem evidência visual não está pronta** — é o equivalente frontend de "testes passam" sem rodar a suíte (skill `tdd`).
