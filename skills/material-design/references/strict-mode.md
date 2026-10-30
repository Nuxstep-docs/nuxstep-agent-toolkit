# Modo Estrito — Material Design

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Zero cor literal fora do tema** — lint falha com hex/`Color(...)` em componente (Flutter: `avoid_hardcoded_colors` custom; web: regra eslint própria).
2. **Contraste auditado além dos pares** — combinações customizadas passam por verificação automatizada (axe/teste de contraste) nos fluxos principais.
3. **Regressão visual dos componentes tematizados** — golden tests (Flutter) / screenshots (web) nos dois temas, claro e escuro.
4. **Upgrade de kit com changelog revisado** — atualização do Material/MUI entra com revisão dos breaking changes de tema registrada no PR.
