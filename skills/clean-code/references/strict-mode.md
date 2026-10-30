# Modo Estrito — Clean Code

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`. Em projetos `essential`, ignore este arquivo.

1. **Zero warnings como gate** — lint/compilador com warnings tratados como erro no CI; supressão de regra (`eslint-disable`, `@SuppressWarnings`...) exige comentário com justificativa na linha.
2. **Complexidade limitada por lint** — complexidade ciclomática máxima 10 por função, enforced pela ferramenta da stack (ex.: ESLint `complexity`, PMD/Checkstyle, Pylint) — nunca de cabeça.
3. **API pública documentada** — toda função/classe exportada do módulo tem doc curta (JSDoc/Javadoc/docstring): contrato, erros lançados e um exemplo quando a assinatura não bastar.
4. **Sem escape de tipos** — proibido `any`/cast silencioso (TS), `Object` cru (Java), `// @ts-ignore` sem justificativa; limites de entrada validados com schema (ex.: zod) antes do cast.
5. **Máximo 3 parâmetros por função** — acima disso, objeto de parâmetros nomeados.
6. **Dead code sai no mesmo PR** — código que a mudança tornou morto é removido junto (o histórico fica no git).
