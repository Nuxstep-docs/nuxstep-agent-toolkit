---
name: hashicorp-vault
description: >-
  Padrões da Nuxstep para HashiCorp Vault (e OpenBao): cofre como fonte única
  de segredos, auth por identidade de máquina, segredos dinâmicos com TTL,
  policies de menor privilégio e auditoria. Use ao configurar ou consumir
  cofre de segredos — também em pedidos implícitos como "onde guardo essa
  credencial", "injeta o segredo no serviço" ou "rotaciona as senhas".
license: Proprietary
metadata:
  globs: "**/vault/**,**/*.hcl"
  category: infra
  visibility: "public"
---

# HashiCorp Vault

Padrões para cofre de segredos (versão vigente: tool MCP `get_approved_stack`; **OpenBao** é o fork MPL compatível — mesma disciplina). **Papel**: o cofre é a FONTE dos segredos; env vars, Secrets K8s e arquivos são só distribuição em runtime — nunca origem nem cópia permanente.

1. **Auth por identidade de máquina** — Kubernetes auth para pods, OIDC/JWT para CI (skill `github-actions`), AppRole onde não há identidade nativa; token estático de longa duração em aplicação é o anti-padrão nº 1. Token root fica selado para emergência, nunca em uso rotineiro.
2. **Segredo dinâmico primeiro** — onde o backend suporta (DB, nuvem), credencial efêmera com TTL gerada por demanda vence segredo estático: vazou, expira sozinha; revogou, morreu.
3. **KV v2 para estáticos** — versionamento + soft delete; caminho padronizado `kv/<projeto>/<ambiente>/<serviço>` (o inventário nasce da convenção).
4. **Policy de menor privilégio por caminho** — cada app lê só o próprio caminho; `path "kv/*"` em policy de aplicação é achado de review.
5. **Rotação com dono e prazo** — segredo estático no cofre continua precisando de rotação; o cofre a torna barata (troca num lugar, apps releem). Registre dono/prazo.
6. **Auditoria desde o dia 1** — audit device ligado (quem leu o quê, quando); cofre sem trilha é cofre às cegas.
7. **Unseal e DR resolvidos** — auto-unseal via KMS da nuvem; snapshot do storage com restore ensaiado; perder o cofre = perder todas as credenciais da organização.
8. **Integração pelas pontas certas** — K8s: External Secrets Operator/CSI (skill `kubernetes`); Ansible: lookup de vault (skill `ansible`); app: client oficial com renovação de lease — nunca "baixar tudo no boot e guardar em arquivo".
9. **Segredo não aparece em log** — resposta do Vault nunca é logada/ecoada; CI com masking conferido.

## Não faça

- ❌ Token root/estático de longa duração em app ou CI → ✅ auth por identidade + TTL
- ❌ Copiar do Vault para `.env` commitado → ✅ injeção em runtime (ESO/CSI/client)
- ❌ Policy `path "*"` → ✅ menor privilégio por caminho do serviço
- ❌ Cofre sem audit device → ✅ auditoria ligada antes do primeiro segredo
- ❌ Backup do cofre nunca restaurado → ✅ restore ensaiado (é o single point das credenciais)

## Quando ler o quê

- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
