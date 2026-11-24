# Modo Estrito — Direção Visual

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Plano de design versionado** — o plano de tokens/princípios (passo 2.1) entra no repo (`docs/design/`) e é revisado antes do build; mudança de direção é PR, não improviso.
2. **Tokens formais** — o plano vira tokens reais (custom properties/`@theme`/ThemeData) desde o primeiro componente; valor mágico é reprovável (herda `html-css`/`tailwindcss` strict).
3. **Revisão de design com evidência** — PR de UI traz screenshots desktop+mobile e a autocrítica do passo 2.2 ("o que seria default e foi revisado"); regressão visual nos componentes base.
4. **Auditoria anti-template** — checklist da seção 4 aplicado em review; item da lista presente sem pedido do brief é achado.
5. **Piso verificado por ferramenta** — axe/Lighthouse e CWV como gates (herda `html-css` strict).
