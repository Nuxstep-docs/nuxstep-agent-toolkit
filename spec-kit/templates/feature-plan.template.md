<!-- INSTRUÇÃO PARA O AGENTE: Este é o artefato da FASE 2: PLAN. O agente local DEVE OBRIGATORIAMENTE ler o arquivo `spec.md` gerado anteriormente E as "Skills" globais antes de preencher este plano. Crie em /specs/features/nome-da-feature/plan.md -->
# Plano Técnico: {{FEATURE_NAME}}

## 1. Resumo da Solução
(Breve explicação de alto nível de como resolveremos a `spec` em termos de engenharia. Qual é o plano de ataque?)

## 2. Alterações de Banco de Dados / Estado
(Se não houver, escreva "N/A")
- **Migrations SQL necessárias:** (Ex: `ALTER TABLE ...`)
- **Novas Tabelas / Índices:**
- **Esquemas NoSQL / Filas Kafka:**

## 3. Componentes e Arquivos Afetados
Liste os diretórios e principais componentes arquiteturais que serão criados ou editados. Use a árvore de pastas.
- `src/domain/...`
- `src/application/use-cases/...`
- `src/infrastructure/adapters/...`

## 4. Integrações de Rede e Segurança
- **Chamadas Externas (Outbound):** Nós chamaremos quais APIs de terceiros? Quais são os Timeouts? Tem Circuit Breaker?
- **Segurança (Inbound):** Qual a regra de autenticação (JWT)? Tem rate limiting? Quais *roles* podem acessar?

## 5. Observabilidade (Instrumentação)
Como saberemos que a funcionalidade está saudável em produção?
- **Métricas Prometheus:** (Ex: Criar métrica `payment_processed_total`)
- **Logs:** Onde injetaremos logs JSON de erro/auditoria?

## 6. Estratégia de Testes
- **Testes Unitários:** O que vamos mockar? (Services, Repositories)
- **Testes de Integração:** O que precisa de um container de banco (ex: Testcontainers) para testar a rota inteira?
