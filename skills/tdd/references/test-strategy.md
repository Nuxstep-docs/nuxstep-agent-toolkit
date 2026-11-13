# Estratégia de teste por componente

O ciclo (red-green-refactor) diz COMO; este pack diz **o que testar onde** ao planejar a suíte de uma feature ou auditar cobertura existente.

## Pirâmide como orçamento

Muitos testes de unidade (rápidos, focados), alguns de integração (médios), poucos e2e (lentos, alta confiança). Pirâmide invertida — e2e pesado sobre unidade rala — é suíte que demora, flake-a e ninguém roda.

## Por tipo de componente

| Componente | Testar com | O que importa |
|---|---|---|
| **Regra de negócio / use case** | Unidade, estilo Chicago (objetos reais) | Todas as variações da regra; é aqui que mora a maioria dos testes |
| **Endpoint/API** | Unidade na regra + integração na camada HTTP (status, validação, serialização) | Contrato: um consumidor existente não pode quebrar sem o teste acusar |
| **Repositório/adapter de banco** | Integração com banco real (Testcontainers — skill da stack) | Query certa, mapeamento, transação; mock de ORM não testa nada disso |
| **Pipeline/consumer de dados** | Unidade na transformação + **idempotência** (processar 2× = mesmo resultado) e validação de entrada | Mensagem duplicada/malformada é o caso normal (skills `kafka`/`rabbitmq`) |
| **Frontend** | Componente por comportamento (`getByRole`) + e2e dos fluxos críticos (skill `playwright`) + a11y | O que o usuário vê e faz, não detalhes de render |
| **Infra/deploy** | Smoke test pós-deploy nos fluxos-chave | "Subiu e responde" verificado por máquina, não por fé |

## O que cobrir, o que pular

- **Cobrir**: caminho crítico de negócio, tratamento de erro (o caminho triste é onde mora o incidente), bordas de segurança (authz: quem NÃO pode acessar), integridade de dados, edge cases de entrada (vazio, nulo, limite).
- **Pular**: getters/setters triviais, código do framework, script descartável. Teste que nunca pode falhar é custo sem informação.

## Plano de teste (saída ao planejar)

Para cada área da feature: o que testar · tipo de teste · exemplo de caso. Lacunas de cobertura apontadas contra o caminho crítico, não contra percentual (percentual é assunto do strict-mode).
