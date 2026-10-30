---
name: argocd
description: >-
  Padrões da Nuxstep para GitOps com Argo CD: git como única fonte do cluster,
  Applications por serviço/ambiente, sync automatizado com prune/selfHeal,
  migrations como PreSync hook e rollback por git revert. Use ao configurar ou
  operar deploy contínuo em Kubernetes — também em pedidos implícitos como
  "automatiza o deploy no cluster", "o app está OutOfSync" ou "faz rollback".
license: Proprietary
metadata:
  globs: "**/argocd/**,**/applications/*.yaml,**/argo/**"
  category: devops
  visibility: "public"
---

# Argo CD (GitOps)

Padrões para GitOps em Kubernetes (versão vigente: tool MCP `get_approved_stack`). Fecha a regra da skill `kubernetes`: **o cluster converge do git** — mudança entra por PR no repo de manifests, nunca por `kubectl`.

1. **Git é a única fonte** — estado desejado vive em repo de manifests (kustomize overlays por ambiente); o CI do serviço builda a imagem e atualiza o manifest **por PR** (tag nova = diff revisável), não por push direto.
2. **Uma Application por serviço+ambiente** — gerenciadas via **ApplicationSet** (ou app-of-apps) para não duplicar YAML; Application gigante "do cluster inteiro" é raio de explosão.
3. **Sync automatizado com `prune` + `selfHeal`** em ambientes maduros — recurso órfão some, drift é revertido sozinho; produção pode exigir gate (sync window/manual) conforme o processo do projeto — decisão declarada, não default acidental.
4. **OutOfSync é sinal** — ou alguém fez ClickOps (reverta e eduque) ou um controller muta campos legitimamente → `ignoreDifferences` **deliberado e comentado** para esses campos, nunca silenciar o app inteiro.
5. **Migration é PreSync hook** — job de migração de banco roda como hook antes do rollout (skill `postgresql`/migrations-safety); deploy que corre junto com a migração é corrida.
6. **AppProject por projeto/time** — restringindo repos de origem, clusters/namespaces de destino e quem pode sync; apps nunca no project `default`.
7. **Segredo não entra no git** — Argo não resolve segredo: External Secrets Operator (cofre → Secret) ou SOPS; manifesto com segredo plano é vazamento versionado para sempre.
8. **Rollback = `git revert`** — reverter o commit do manifest e deixar convergir; rollback por kubectl/UI diverge do git e volta no próximo sync.
9. **Health e notificações** — health checks dos recursos + notificação de sync falho/degraded no canal do time; deploy silenciosamente quebrado é o pior estado.

## Não faça

- ❌ `kubectl apply`/`edit` em cluster gerido pelo Argo → ✅ PR no repo de manifests
- ❌ Segredo plano no repo GitOps → ✅ External Secrets/SOPS
- ❌ Silenciar OutOfSync sem entender → ✅ `ignoreDifferences` cirúrgico e comentado
- ❌ Rollback pela UI/kubectl → ✅ `git revert` + convergência
- ❌ Apps no project `default` → ✅ AppProject com escopo mínimo

## Quando ler o quê

- Skill `kubernetes` — manifests que o Argo sincroniza seguem aqueles padrões (probes, resources, GitOps).
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
