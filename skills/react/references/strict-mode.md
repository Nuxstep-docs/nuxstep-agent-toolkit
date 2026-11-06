# Modo Estrito — React

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Lint como gate** — `eslint-plugin-react-hooks` (incl. regras do Compiler) e `jsx-a11y` com zero warnings no CI.
2. **React Compiler ativo e sem bailouts silenciosos** — componentes que o Compiler pula (ex.: `ref.current` lido no render) são corrigidos, não ignorados.
3. **Teste de componente obrigatório** para todo componente com lógica condicional ou interação (herda cobertura da skill `tdd` strict).
4. **Acessibilidade verificada** — axe (vitest-axe) nos fluxos principais; violações bloqueiam o PR.
5. **Estado global auditado** — store global (Zustand/context) só com justificativa em PR; estado de servidor nunca copiado para store de UI.
6. **`<StrictMode>` ligado em dev** — efeitos precisam sobreviver ao double-invoke; quebrar no StrictMode é bug, não ruído.
