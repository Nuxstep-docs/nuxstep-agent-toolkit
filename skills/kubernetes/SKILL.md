---
name: kubernetes
description: >-
  Padrões da Nuxstep para Kubernetes: probes com filosofia certa, resources
  obrigatórios, imagens imutáveis, securityContext endurecido, secrets de cofre
  externo, NetworkPolicy e deploy via GitOps. Use sempre que criar ou alterar
  manifests, charts Helm/kustomize ou configuração de cluster — também em
  pedidos implícitos como "coloca no cluster", "o pod está reiniciando" ou
  "escreve o deployment".
license: Proprietary
metadata:
  globs: "**/*.yaml,**/*.yml,**/helm/**,**/k8s/**,**/kustomize/**"
  category: infra
  visibility: "public"
---

# Kubernetes

Kubernetes não garante alta disponibilidade sozinho — nós configuramos. (Versão vigente e quando usar K8s em vez de um degrau mais simples: tool MCP `get_approved_stack` + packs de compute das skills `azure`/`aws` — AKS/EKS exigem ADR.)

1. **Liveness raso, readiness profundo** — `readinessProbe` diz "pronto para tráfego" (pode checar dependências); `livenessProbe` diz "travou irrecuperavelmente" e **só checa o próprio processo** — liveness que checa o banco transforma instabilidade momentânea em restart em massa. Ambas obrigatórias.
2. **`resources` sempre** — `requests` dimensionados por medição; `limits` de memória = evita OOM surpresa do nó (limit de CPU é opcional: throttling; prefira requests corretos).
3. **Produção: `replicas >= 2` + PDB** — app stateless (sessão fora da memória) e `PodDisruptionBudget` garantindo 1 pod vivo durante manutenção de nós.
4. **Imagem imutável e endurecida** — semver/digest (nunca `:latest`); `securityContext` com `runAsNonRoot`, `readOnlyRootFilesystem` onde couber e `capabilities: drop: [ALL]`.
5. **Namespace por aplicação/ambiente** — com `ResourceQuota`/`LimitRange` em cluster compartilhado; RBAC por namespace, não cluster-admin para apps.
6. **Secret de verdade vem de cofre** — Secret K8s é base64, não criptografia: produção usa External Secrets Operator/CSI apontando para o cofre (skill `hashicorp-vault`/Key Vault); RBAC restringindo quem lê Secrets.
7. **NetworkPolicy default-deny** em produção — pods só falam com quem precisam; sem policy, o cluster inteiro é uma rede plana.
8. **Deploy é GitOps** — manifests versionados (kustomize overlays por ambiente, ou Helm para o que é distribuído); o cluster converge do git (skill `argocd`); `kubectl apply`/`edit` manual só em dev — em produção é drift.
9. **Desligamento gracioso** — app trata SIGTERM (fecha conexões, drena); `terminationGracePeriodSeconds` condizente; deploy sem isso derruba requests a cada rollout.
10. **HPA por métrica real** — escale por CPU/memória medidos ou métrica custom (fila, RPS); HPA sem requests corretos escala errado.

## Não faça

- ❌ `:latest` em produção → ✅ semver/digest fixo
- ❌ Pod sem `resources` → ✅ requests/limits sempre
- ❌ Liveness checando banco/dependência → ✅ liveness raso; dependência é readiness
- ❌ Secret K8s como "criptografia" → ✅ cofre externo + RBAC (base64 é encoding)
- ❌ `kubectl edit` em produção → ✅ mudança via git (GitOps); o cluster converge

## Quando ler o quê

- [deployment.yaml](references/deployment.yaml) — blueprint com probes, resources, securityContext e graceful shutdown. Consulte ao criar workloads.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
