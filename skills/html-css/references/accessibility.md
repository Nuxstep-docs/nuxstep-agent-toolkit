# Acessibilidade — checklist barato + padrões ARIA

## Checklist (custa minutos, evita retrabalho)

1. Navegue a página inteira só com `Tab`/`Enter`/`Esc` — tudo alcançável, foco sempre visível, ordem lógica.
2. Headings contam a estrutura (ferramenta: árvore de acessibilidade do DevTools).
3. Contraste: 4.5:1 texto normal, 3:1 texto grande e componentes de UI (checar no DevTools).
4. Formulários: todo input com `label` (ou `aria-label` se o design esconde); erro de validação anunciado junto ao campo (`aria-describedby` + `aria-invalid`), não só cor.
5. Imagens: `alt` descreve a FUNÇÃO ("Logo da Nuxstep — voltar ao início"), não a aparência; decorativa = `alt=""`.
6. Nada pisca/anima para quem pediu `prefers-reduced-motion`.
7. Zoom 200% não quebra nem esconde conteúdo.

## Padrões ARIA dos componentes comuns

| Componente | Padrão mínimo |
|---|---|
| Modal | `role="dialog"` + `aria-modal` + foco preso dentro + `Esc` fecha + foco volta ao gatilho — ou simplesmente `<dialog>` nativo com `showModal()` |
| Menu dropdown | `button[aria-expanded][aria-controls]`; setas navegam; `Esc` fecha. Avalie `<details>` nativo antes |
| Tabs | `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, setas trocam de aba |
| Toast/alerta | `role="status"` (informativo) ou `role="alert"` (erro) — anuncia sem roubar foco |
| Loading | `aria-busy` na região + `role="status"` com texto ("Carregando resultados") |

**Prefira o elemento nativo que já faz tudo** (`<dialog>`, `<details>`, `<select>`): o custo de reimplementar o comportamento de teclado/foco de um componente custom é alto e raramente vale.
