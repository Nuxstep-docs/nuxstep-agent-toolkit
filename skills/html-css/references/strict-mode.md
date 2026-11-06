# Modo Estrito — HTML & CSS

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **WCAG 2.2 AA auditado por ferramenta** — axe (unit/e2e) + Lighthouse a11y ≥ 95 nos fluxos principais, como gate de CI; violação bloqueia PR.
2. **Design tokens formais** — todas as cores/espaçamentos/tipografia vêm de tokens (custom properties geradas de uma fonte única); valor mágico (`#3b82f6` solto, `margin: 13px`) é reprovável.
3. **Stylelint como gate** — config padrão + proibição de `!important` fora de `@layer utilities`, de `#id` e de nesting > 3 níveis.
4. **Orçamento de CSS** — tamanho do CSS crítico por rota monitorado; estourou, justifica ou corta.
5. **Teste de regressão visual** nos componentes de design system (Playwright screenshots) — mudança visual é diff revisado, não surpresa.
6. **Suporte declarado** — browserslist explícito no repo; feature fora da Baseline exige fallback testado.
