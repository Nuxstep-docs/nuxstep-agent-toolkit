# Modo Estrito — Kubernetes

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Admission policy como gate** — Pod Security Standards `restricted` no namespace + validação (Kyverno/ValidatingAdmissionPolicy): sem resources, root ou `:latest`, o manifest é REJEITADO pelo cluster, não apontado em review.
2. **Lint de manifest no CI** — kube-score/kubeconform + `helm lint`/`kustomize build` verificados em todo PR.
3. **NetworkPolicy auditada** — default-deny comprovado por teste (pod de teste não alcança o que não deve); exceções documentadas.
4. **Imagens escaneadas e assinadas** — scan de CVE no push (Trivy) com gate de severidade; assinatura (cosign) verificada por admission em produção.
5. **Rollout com verificação** — readiness gates/análise (Argo Rollouts ou health checks do ArgoCD) antes de completar; rollback automático em falha.
6. **Backup do estado do cluster** — Velero (ou equivalente) para recursos e volumes críticos, com restore ensaiado.
