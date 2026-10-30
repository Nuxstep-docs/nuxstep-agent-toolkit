# AWS — escolha de compute (escada da dose certa)

Comece pelo degrau mais simples que atende; subir depois é barato, descer é projeto.

| Workload | Serviço | Por quê / custo típico |
|---|---|---|
| Site estático, SPA | **S3 + CloudFront** | Centavos/mês; TLS e CDN resolvidos (Amplify Hosting se quiser CI embutido) |
| API/serviço em container, tráfego variável | **App Runner** | O "Container Apps" da AWS: deploy do container, escala gerenciada, pouco conhecimento de rede exigido |
| Serviços em container com mais controle (rede, sidecars, service discovery) | **ECS Fargate** | Sem nós para operar; integra ALB/Cloud Map; o cavalo de batalha |
| Evento, webhook, cron, fila | **Lambda** (+ EventBridge/SQS) | Paga por execução; zero ocioso |
| Job batch | **ECS Fargate task** / Batch | Mesmo container, execução sob demanda |
| Plataforma multi-time com operadores/malha | **EKS — só com ADR** | Poder do Kubernetes, custo de operação alto (upgrades, addons, nós) |
| Software legado/prateleira preso a SO | **EC2 — último recurso** | Patch/backup/hardening são seus (skill `linux-shell`); prefira AMI gerenciada + SSM |

## Sinais de que é hora de subir de degrau

- App Runner → Fargate: precisa de VPC fina, sidecar, service discovery, ou o preço do App Runner passou o do Fargate no seu perfil de tráfego.
- Fargate → EKS: dezenas de serviços, operadores/CRDs necessários, time dedicado de plataforma.
- Lambda → container: cold start no caminho crítico, execução > 15 min, dependências pesadas.

## Regras transversais

1. Tudo atrás de ALB/API Gateway/CloudFront — compute nunca exposto direto.
2. Custo estimado antes de criar (pricing calculator) + budget — NAT Gateway e transferência entre AZs são os custos surpresa clássicos.
3. Acesso administrativo por **SSM Session Manager**, não SSH aberto (nem bastion com porta 22 pública).
