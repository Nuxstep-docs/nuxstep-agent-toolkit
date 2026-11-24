# Modo Estrito — Argo CD

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Produção com progressive delivery** — Argo Rollouts (canary/blue-green) com análise automática e rollback em métrica degradada.
2. **Diff no PR de manifests** — CI roda `kustomize build` + diff contra o estado atual e posta no PR; merge sem diff revisado é bloqueado.
3. **RBAC SSO integrado** — login via IdP (roles por grupo); conta local/admin desabilitada; ações de sync auditadas.
4. **Sync windows em produção** — janelas definidas (ou aprovação) para serviços críticos; exceção documentada.
5. **Segredos auditados** — scanner no repo GitOps (gitleaks) como gate; External Secrets com rotação testada.
6. **App drift alertado** — OutOfSync/Degraded persistente (>N min) abre alerta/issue automaticamente.
