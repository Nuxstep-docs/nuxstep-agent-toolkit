# Modo Estrito — TailwindCSS

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Zero valores arbitrários** — `[...]` proibido fora de arquivo de tema; lint (eslint-plugin-tailwindcss ou regra própria) falha o CI.
2. **Tokens 100% semânticos nos componentes** — escala crua (`red-600`, `gray-50`) só dentro da definição de tokens; componente referencia semântica.
3. **prettier-plugin-tailwindcss como gate** — diff de formatação falha o CI.
4. **Design system com regressão visual** — componentes base com golden screenshots (Playwright) — herda `html-css` strict.
5. **Auditoria de classes mortas** — build de produção revisado por tamanho; crescimento anômalo do CSS investigado (classe dinâmica vazando para o scanner).
