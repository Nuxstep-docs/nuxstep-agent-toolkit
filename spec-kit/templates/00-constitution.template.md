<!-- INSTRUÇÃO PARA O AGENTE: Este arquivo serve como a âncora filosófica e arquitetural central do projeto. Ele não documenta COMO fazer algo, mas sim os valores inegociáveis e limites arquiteturais que governam as decisões técnicas deste repositório. O agente local (Cursor/Copilot) deve lê-lo regularmente. Preencha os placeholders {{ }}. -->
# 00 - Constituição do Projeto: {{PROJECT_NAME}}

## 1. Objetivo Principal
Descreva, em um ou dois parágrafos, a principal dor que este sistema resolve para o negócio. Se este sistema parasse de funcionar hoje, o que a empresa perderia?

## 2. Limites Arquiteturais Inegociáveis (Hard Boundaries)
Liste as regras que não podem ser violadas de jeito nenhum neste repositório:
- Ex: "A Camada de Domínio nunca pode depender do banco de dados (Infra)."
- Ex: "Todos os endpoints devem responder em menos de 100ms."
- Ex: "Proibido usar bancos relacionais; este serviço usa apenas Event Sourcing."

## 3. Stack Tecnológica Core
*Atenção: A configuração exata de quais skills usar deve residir no arquivo `.ai-config.json`. Apenas resuma a filosofia aqui.*
- **Linguagem:** {{LINGUAGEM}}
- **Framework Principal:** {{FRAMEWORK}}
- **Armazenamento:** {{DATABASE}}
- **Infraestrutura Básica:** {{INFRA}}

## 4. O Que Nós NÃO Fazemos (Anti-Objetivos)
Defina de forma explícita problemas que este projeto não tentará resolver e escopos que pertencem a outros serviços.
- Não faremos X.
- A responsabilidade de Y será delegada ao sistema Z.
