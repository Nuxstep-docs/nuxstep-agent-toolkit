---
name: clean-code
description: >-
  Padrões universais de legibilidade e qualidade de código da Nuxstep — nomes,
  funções, comentários, tratamento de erros, duplicação — válidos para qualquer
  linguagem. Use sempre que escrever, alterar, refatorar ou revisar código, em
  qualquer projeto, mesmo que o pedido não cite "clean code" (ex.: "refatore
  isso", "esse código está confuso", "melhore a legibilidade", "dá uma limpada
  nessa função").
license: Proprietary
metadata:
  globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.java,**/*.py,**/*.php,**/*.go,**/*.cs,**/*.dart,**/*.rb,**/*.sh"
  category: fundamentals
  visibility: "public"
---

# Clean Code

Legibilidade é requisito, não estética: código é lido muito mais vezes do que escrito. Regras essenciais, baratas em qualquer projeto:

1. **Nomes revelam intenção** — o leitor entende sem abrir a implementação. Função = verbo (`createInvoice`), booleano = pergunta (`isExpired`, `hasAccess`), sem abreviação críptica nem nome genérico (`data2`, `handler`, `util`). Renomear é o refactor mais barato que existe.
2. **Profundidade antes de tamanho** — prefira funções *profundas*: interface simples escondendo trabalho substancial. Extraia um trecho quando um bom nome melhorar a leitura — não para cumprir limite de linhas; micro-funções em excesso só movem a complexidade para as conexões entre elas.
3. **Um nível de abstração por função** — não misture regra de negócio com detalhe de I/O ou formatação no mesmo bloco.
4. **Guard clauses** — valide e retorne cedo no topo da função; evite aninhamento profundo de condicionais.
5. **Comentários explicam o PORQUÊ** — decisões, restrições e armadilhas que o código não consegue mostrar; são obrigatórios aí, e proibidos como narração do óbvio. Código comentado e TODO órfão não entram em commit (viram issue ou spec).
6. **Escopo mínimo e imutabilidade por padrão** — declare perto do uso; prefira `const`/valores imutáveis; evite estado compartilhado mutável.
7. **Erro nunca é silenciado** — sem `catch` vazio: propague com contexto ou trate de verdade. Mensagem de erro diz o que falhou e com quais dados.
8. **Duplicação: regra dos três** — duplicar duas vezes é aceitável; na terceira, extraia. A abstração errada custa mais que a duplicação: só unifique o que muda pelas mesmas razões.
9. **Consistência local vence preferência pessoal** — siga o estilo do arquivo/projeto; formatação é decisão de lint/formatter, não de review.
10. **Regra do escoteiro, com juízo** — deixe o código tocado um pouco melhor; refatoração grande não entra no mesmo commit da feature.

**Testabilidade é sinal de design:** dificuldade de testar denuncia acoplamento — veja as skills `tdd` (método) e `software-architecture` (estrutura).

## Não faça

- ❌ Reformatar/renomear arquivos inteiros no commit da feature → ✅ mudança mínima; limpeza em commit próprio
- ❌ Criar helper/abstração "para o futuro" → ✅ YAGNI: só o que o caso atual pede
- ❌ Engolir erro para o lint/teste parar de reclamar → ✅ trate ou propague com contexto
- ❌ `// TODO` sem dono no commit → ✅ vira issue ou entra na spec
- ❌ Nome genérico que obriga a abrir a implementação (`process`, `data2`) → ✅ nome que conta a regra

## Quando ler o quê

- [refactoring.md](references/refactoring.md) — catálogo de *smells* → refactor correspondente, com antes/depois. Leia ao refatorar código existente ou quando algo incomoda e você não sabe nomear o problema.
- [tech-debt.md](references/tech-debt.md) — taxonomia de dívida técnica, fórmula de priorização e regras de pagamento. Leia em auditoria de codebase ou ao decidir qual refactor fazer primeiro.
- [strict-mode.md](references/strict-mode.md) — regras adicionais, aplicáveis somente em projetos com `Rigor do projeto: strict`.
