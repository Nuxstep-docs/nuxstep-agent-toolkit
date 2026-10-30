---
name: aws
description: >-
  Governança e padrões da Nuxstep para AWS: escolha de compute na dose certa
  (App Runner/Fargate antes de EKS), IAM de menor privilégio com OIDC, dados em
  subnets privadas, S3 sem acesso público, tags FinOps e budgets. Use sempre
  que desenhar topologia, criar/revisar recursos AWS ou decidir hospedagem —
  também em pedidos implícitos como "sobe na AWS", "configura o bucket" ou
  "quanto custa essa arquitetura".
license: Proprietary
metadata:
  globs: "**/*.tf,**/aws/**,**/cloudformation/**"
  category: cloud
  visibility: "public"
---

# AWS

Padrões para AWS (serviços vigentes: tool MCP `get_approved_stack`). Infra nasce de IaC (skill `terraform`); ClickOps em produção é proibido.

1. **Compute pela escada da dose certa** — estático → S3+CloudFront; serviço em container → App Runner (gerenciado, o degrau simples) ou ECS Fargate (mais controle, sem nós); evento/cron → Lambda + EventBridge; **EKS só com ADR** (dezenas de serviços + time para operar); EC2 é último recurso (você vira dono do SO — skill `linux-shell`). Tabela: [compute-choice.md](references/compute-choice.md).
2. **IAM de menor privilégio** — sem `*` absoluto em `Action`/`Resource`; permissão por **role** (nunca user com access key para serviços); CI entra por **OIDC** (skill `github-actions`), humanos por SSO/Identity Center. Access key de longa duração é passivo de vazamento.
3. **Dados em subnet privada** — RDS/ElastiCache/OpenSearch jamais públicos; entrada só por ALB/API Gateway; saída via NAT consciente (NAT tem custo por GB — avalie endpoints VPC).
4. **S3 com Block Public Access ligado** — acesso externo por CloudFront (OAC) ou presigned URL com expiração; bucket público é decisão documentada, não default.
5. **Criptografia por padrão** — KMS em repouso (S3, EBS, RDS), TLS em trânsito; chaves gerenciadas pelo serviço bastam até requisito dizer o contrário.
6. **Multi-AZ conforme o SLA pago** — produção com 2+ AZs em banco e serviço; dev/staging single-AZ (custo).
7. **Tags FinOps + budget no dia 1** — `Environment`, `Project`, `CostCenter`, `Owner` em tudo; AWS Budgets com alerta em 80%/100% por conta/projeto.
8. **CloudWatch com retenção definida** — log group sem retenção = custo infinito; métricas/alarmes nos sinais que acordam alguém.
9. **Uma conta por ambiente quando o projeto cresce** (Organizations) — blast radius e fatura separados; projetos pequenos: separação por tags+budgets no mínimo.

## Não faça

- ❌ Access key de longa duração em CI/serviço → ✅ role + OIDC
- ❌ `"Action": "*"` ou `"Resource": "*"` em policy → ✅ escopo mínimo nomeado
- ❌ Banco em subnet pública "para facilitar o acesso" → ✅ privada + bastion/SSM Session Manager
- ❌ Bucket público para servir arquivos → ✅ CloudFront OAC / presigned URL
- ❌ EKS para meia dúzia de containers → ✅ App Runner/Fargate (degrau certo)

## Quando ler o quê

- [compute-choice.md](references/compute-choice.md) — tabela de decisão de hospedagem AWS com custos típicos e sinais de upgrade de degrau. Leia ao decidir onde hospedar qualquer workload.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
