# Modo Estrito — Playwright

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **e2e no CI como gate** — fluxos críticos rodando em todo PR (com `retries: 1` e trace retido em falha); vermelho bloqueia merge.
2. **Evidência visual obrigatória em PR de UI** — screenshot(s) do antes/depois no corpo do PR; sem evidência, devolução mecânica (skill `github-review-pr`).
3. **Regressão visual nos componentes do design system** — `toHaveScreenshot()` com baseline versionada; diff visual é revisado, não surpresa.
4. **Acessibilidade automatizada no e2e** — `@axe-core/playwright` nos fluxos principais; violação bloqueia (herda `html-css` strict).
5. **Orçamento de flake** — teste que falha intermitente 2x na semana é quarentenado com issue; suíte instável é pior que suíte ausente.
