# Runbook — checklist de deploy

Para release com risco real (migração de banco, mudança de contrato, feature grande) ou qualquer deploy fora da rotina. A regra que paga o runbook inteiro: **os gatilhos de rollback são decididos ANTES do deploy, com números** — durante o incidente ninguém decide bem.

## Pré-deploy

- [ ] CI verde no commit exato que vai subir (não "no branch")
- [ ] PRs revisados e aprovados; diff da release conferido (o que está indo?)
- [ ] Migração de banco testada e **lock-safe** (pack `migrations-safety.md` da skill `postgresql`) — e compatível com a versão anterior do app (deploy e migração não são atômicos)
- [ ] Feature flags configuradas no estado inicial correto
- [ ] Plano de rollback escrito: comando/ação concreta (`git revert` + pipeline, ArgoCD rollback — skill `argocd`) e quem executa
- [ ] **Gatilhos de rollback definidos**: taxa de erro > X%, p99 > Y ms, fluxo crítico Z falhando — números preenchidos a partir da baseline atual (dashboard RED — skill `grafana`)
- [ ] Quem precisa saber foi avisado (on-call, cliente se houver janela)

## Deploy

- [ ] Staging atualizado e smoke test passou
- [ ] Produção via pipeline com Environment/aprovação (pack `deploy-environments.md`) — canary/gradual se disponível
- [ ] Janela de observação de ~15 min no dashboard RED: erro, latência, saturação
- [ ] Fluxos-chave verificados (smoke automatizado ou roteiro curto)
- [ ] Qualquer gatilho de rollback atingido → **rollback sem debate**; investigação vem depois (skill `incident-response`)

## Pós-deploy

- [ ] Métricas nominais após a janela; alertas quietos
- [ ] Annotation de deploy registrada no Grafana (pack `as-code.md` da skill `grafana` — se o pipeline já faz, confira que fez)
- [ ] Changelog/release notes atualizados; issues da release fechadas
- [ ] Stakeholders avisados do resultado (inclusive se foi rollback)

## Adaptações

- **Com migração destrutiva** (drop/rename): só em deploy separado, padrão expand-contract — nunca no mesmo release que o código novo.
- **Mudança de contrato de API**: consumidores avisados antes; versão antiga servida em paralelo até a migração deles.
- **Rotina madura**: o checklist vira código — os itens automatizáveis (CI verde, smoke, janela de observação, annotation) entram no pipeline e saem do papel.
