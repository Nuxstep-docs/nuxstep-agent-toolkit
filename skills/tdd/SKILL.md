---
name: tdd
description: >-
  Método de trabalho da Nuxstep para desenvolvimento guiado por testes
  (red-green-refactor): o que testar primeiro, estilo por camada
  (Chicago/London), regras anti-fraude de teste e ferramenta padrão por stack.
  Use ao implementar qualquer feature ou correção de bug, ao escrever ou
  ajustar testes, quando um teste falhar, e em pedidos como "adicione testes",
  "corrija esse bug" ou "garanta que isso funciona" — mesmo sem a palavra TDD.
license: Proprietary
metadata:
  globs: "**/*.test.*,**/*.spec.*,**/test/**,**/tests/**,**/__tests__/**"
  category: fundamentals
  visibility: "public"
---

# TDD

Teste primeiro é o método padrão da Nuxstep para regra de negócio: o teste que falha define "pronto" antes do código existir — e impede o pior modo de falha de agentes de IA, **escrever testes que confirmam o comportamento quebrado**.

## 1. O ciclo

1. **RED** — escreva UM teste pequeno do comportamento desejado e **rode-o**: ele deve falhar pelo motivo certo (asserção, não erro de import). Falha verificada é parte do método.
2. **GREEN** — escreva o código mínimo que o faz passar. Resistir à generalização aqui é o que mantém o passo barato.
3. **REFACTOR** — com a suíte verde, melhore nomes e estrutura (skill `clean-code`). Rode tudo de novo.

Repita em passos pequenos. Commits em pontos verdes.

## 2. Regras inegociáveis (especialmente para agentes)

- **Nunca apague, pule (`skip`) ou afrouxe um teste que falha para "ficar verde"** — teste falhando é informação; a correção é no código ou, se o requisito mudou, no teste COM justificativa explícita ao humano.
- **Nunca reporte sucesso sem ter executado a suíte** — saída real do runner, não suposição.
- **Bug fix começa com o teste que reproduz o bug** (vermelho) — só então corrija. É a prova de que o bug não volta.
- **Teste comportamento, não implementação** — asserte o resultado observável (retorno, estado, efeito no port), não detalhes internos; teste que quebra em todo refactor é passivo, não ativo.

## 3. Estilo por camada (casa com a arquitetura hexagonal)

- **Domínio e use cases → estilo Chicago (classicista)**: objetos reais, verificação de **estado**; sem mocks dentro do hexágono.
- **Bordas (controllers, adapters, gateways) → estilo London (mockista)**: dublês para os **ports**, verificação de interação. Mock só no que você possui (o port), nunca na lib de terceiro diretamente.
- Suíte mock-pesada que quebra a cada refactor é o sinal de que London vazou para dentro do domínio.

## 4. Ferramenta padrão por stack

| Stack | Runner |
|---|---|
| TypeScript/JavaScript (Node, React, Next) | Vitest (Jest em legado) |
| Java/Spring Boot | JUnit 5 + AssertJ (+ Testcontainers p/ integração) |
| PHP | Pest (PHPUnit em legado) |
| Flutter/Dart | flutter_test |
| Python | pytest |
| Shell | bats |

Confirme a versão vigente com a tool MCP `get_approved_stack` quando disponível.

## 5. Dose certa (modo essencial)

TDD estrito onde há **regra de negócio, contrato preciso ou alto raio de explosão**. Em código exploratório de UI/protótipo, teste junto ou logo depois é aceitável — mas nada entra em PR sem teste do comportamento principal. Exigências quantitativas (cobertura etc.) são do modo estrito.

## Não faça

- ❌ Apagar/`skip`ar o teste vermelho para "ficar verde" → ✅ conserte o código; requisito mudou? ajuste o teste avisando o humano
- ❌ Escrever o teste depois, moldado ao código que já existe → ✅ RED primeiro em regra de negócio
- ❌ Assert em mock de lib de terceiro (`prisma`, `axios`) → ✅ dublê no SEU port
- ❌ Testar campo privado/ordem interna de chamadas → ✅ comportamento observável
- ❌ Reportar "testes passando" sem executar a suíte → ✅ rode e mostre a saída real

## Quando ler o quê

- [test-doubles.md](references/test-doubles.md) — dummy/stub/spy/mock/fake, quando usar cada um e os antipadrões de mock. Leia ao testar código com dependências (ports, APIs, banco).
- [test-strategy.md](references/test-strategy.md) — o que testar onde, por tipo de componente (API, pipeline, frontend, infra), e o que cobrir vs. pular. Leia ao planejar a suíte de uma feature ou auditar cobertura.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para projetos `Rigor do projeto: strict`.
