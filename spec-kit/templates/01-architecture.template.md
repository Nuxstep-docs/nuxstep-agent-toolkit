<!-- INSTRUÇÃO PARA O AGENTE: O arquivo 01-architecture documenta a topologia geral da aplicação, dependências externas e onde este sistema vive dentro da organização maior. O agente deve preencher com diagramas e tabelas estruturadas de integração. -->
# 01 - Arquitetura e Contexto C4: {{PROJECT_NAME}}

## 1. Diagrama de Contexto (Nível 1 - C4)
Crie um diagrama Mermaid (`mermaid`) ilustrando o usuário, nosso sistema, e os sistemas externos com quem ele interage.

```mermaid
C4Context
  title Diagrama de Contexto de Sistema para {{PROJECT_NAME}}

  Person(user, "Usuário", "Descrição do Usuário")
  System(system, "{{PROJECT_NAME}}", "Propósito Central do Sistema")
  System_Ext(ext1, "Sistema Externo 1", "Integração via API REST")

  Rel(user, system, "Usa")
  Rel(system, ext1, "Envia dados via HTTP POST")
```

## 2. Diagrama de Container (Nível 2 - C4)
Detalhe as peças estruturais que compõem este projeto (Ex: Web App, API Backend, Worker, Banco de Dados, Fila).

```mermaid
C4Container
  title Diagrama de Container para {{PROJECT_NAME}}

  Container(spa, "Single Page App", "React", "Interface de usuário")
  Container(api, "Backend API", "NestJS", "Regras de Negócio e Roteamento")
  ContainerDb(db, "Banco de Dados", "PostgreSQL", "Armazenamento primário")

  Rel(spa, api, "Faz requisições HTTP")
  Rel(api, db, "Lê e Escreve", "Prisma ORM")
```

## 3. Integrações e Contratos Externos
Liste todos os serviços e componentes de terceiros dos quais nós dependemos para operar em produção, indicando sua criticidade (Alta/Média/Baixa).

| Dependência (Ex: API de Pagamento) | Tipo de Contrato (Ex: REST, gRPC) | Criticidade | Cenário de Fallback caso fora do ar |
|------------------------------------|-----------------------------------|-------------|---------------------------------------|
| -                                  | -                                 | -           | -                                     |
