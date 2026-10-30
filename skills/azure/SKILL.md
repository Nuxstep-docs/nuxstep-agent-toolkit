---
name: azure
description: >-
  Governança e padrões da Nuxstep para a nuvem Microsoft Azure (a preferencial
  do playbook): escolha de compute na dose certa (Container Apps primeiro), Managed
  Identities, Private Endpoints, tags FinOps, budgets e IaC obrigatório. Use
  sempre que desenhar topologia, criar/revisar recursos Azure ou decidir onde
  hospedar — também em pedidos implícitos como "sobe isso na nuvem", "quanto
  isso vai custar" ou "configura o deploy na Azure".
license: Proprietary
metadata:
  globs: "**/*.tf,**/*.bicep,**/azure/**"
  category: cloud
  visibility: "public"
---

# Azure

Padrões para a nuvem preferencial da Nuxstep (serviços/versões vigentes: tool MCP `get_approved_stack`). Infra nasce de IaC (skill `terraform`); ClickOps em produção é proibido.

1. **Compute pela escada da dose certa** — comece pelo degrau mais simples que serve: Static Web Apps (front) → Container Apps (serviços; scale-to-zero é o padrão do playbook) → Functions (event-driven puro) → AKS **só** com justificativa em ADR (multi-serviço grande, time para operá-lo). Tabela de decisão: [compute-choice.md](references/compute-choice.md).
2. **Resource group por ciclo de vida** — o que morre junto, vive junto; apagar o RG limpa o ambiente inteiro sem órfãos.
3. **Tags FinOps obrigatórias** em todo recurso: `Environment`, `Project`, `CostCenter`, `Owner` — sem tag, custo não tem dono (mesma regra da skill `terraform`).
4. **Budget + alerta no dia 1** — toda assinatura/RG de projeto com orçamento mensal e alerta em 80%/100%; surpresa de fatura é incidente de processo, não de nuvem.
5. **Managed Identity primeiro** — serviço↔serviço sem connection string/senha onde a identidade gerenciada serve; segredo restante vive no Key Vault, referenciado (nunca copiado para app settings em texto).
6. **PaaS atrás de Private Endpoint** — banco, storage e Key Vault de produção fora da internet pública; exposição é exceção justificada.
7. **RBAC por grupo, menor privilégio** — papéis a grupos Entra (não a usuários individuais); CI entra por OIDC/service principal com escopo de RG (skill `github-actions`), nunca Owner de assinatura.
8. **Observabilidade com retenção definida** — App Insights + Log Analytics em toda aplicação, com retenção/cap de ingestão configurados (log sem teto é custo infinito).
9. **Região e redundância conscientes** — padrão Brazil South; produção com zona/réplica conforme o SLA que o cliente paga — nem mais, nem menos.

## Não faça

- ❌ Criar recurso de produção no portal "rapidinho" → ✅ IaC (terraform/bicep) sempre
- ❌ Connection string onde Managed Identity funciona → ✅ identity + Key Vault para o resto
- ❌ AKS para meia dúzia de containers → ✅ Container Apps (degrau certo)
- ❌ Recurso sem tags/budget → ✅ FinOps desde o primeiro `apply`
- ❌ Log Analytics sem cap/retenção → ✅ teto de ingestão configurado

## Quando ler o quê

- [compute-choice.md](references/compute-choice.md) — tabela de decisão de hospedagem (SWA, Container Apps, Functions, App Service, AKS, VM) com custos típicos e sinais de upgrade de degrau. Leia ao decidir onde hospedar qualquer workload.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
