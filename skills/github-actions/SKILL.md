---
name: github-actions
description: >-
  Padrões da Nuxstep para CI/CD com GitHub Actions: permissions mínimas,
  actions pinadas por SHA, OIDC em vez de chaves longas, cache, workflows
  reutilizáveis e deploy multi-ambiente com matrix + GitHub Environments. Use
  sempre que criar ou alterar workflows (.github/workflows), configurar
  deploy/CI ou investigar builds — também em pedidos implícitos como "roda os
  testes no PR", "faz o deploy automático" ou "o pipeline está lento".
license: Proprietary
metadata:
  globs: ".github/workflows/*.yml,.github/workflows/*.yaml,.github/actions/**"
  category: devops
  visibility: "public"
---

# GitHub Actions

Padrões para pipelines CI/CD (recursos vigentes: tool MCP `get_approved_stack`).

1. **`permissions` mínimas declaradas** — `permissions: contents: read` no topo de todo workflow; eleve por job só o que o job usa (`id-token: write` para OIDC, `pull-requests: write` para comentar). O default amplo é o raio de explosão de um action comprometido.
2. **Action de terceiro pinada por SHA completo** — tag é mutável (houve incidente real com 76/77 tags reescritas): `uses: owner/action@<sha40> # v4.2.1`, com Dependabot (`github-actions` ecosystem) atualizando os SHAs. Actions `actions/*` oficiais podem usar major tag.
3. **Cloud sem chave longa: OIDC** — `azure/login`/`aws-actions/configure-aws-credentials` com `id-token: write`; secret de nuvem de longa duração em repo é passivo de vazamento.
4. **Segredo de deploy vive no Environment** — não no repo; log nunca ecoa segredo (cuidado com `set -x`).
5. **Injeção de script**: entrada não confiável (`github.event.*` de título/corpo/branch de terceiros) nunca interpolada direto em `run:` — passe por `env:` intermediária.
6. **Cache com chave honesta** — `actions/setup-*` com cache embutido (lockfile na key); cache de dependência, nunca de resultado de teste.
7. **Workflows reutilizáveis** (`workflow_call`) para padronizar pipelines entre repos; composite actions para sequências de passos; copy-paste de workflow é drift.
8. **`concurrency`** — cancele runs obsoletos no PR (`group: pr-${{ github.ref }}`, `cancel-in-progress: true`); serialize deploy por ambiente (`group: deploy-prod`, sem cancel).
9. **`timeout-minutes` em todo job** — job pendurado é cobrança e fila.
10. **Deploy multi-ambiente = matrix × Environments** — matriz para o leque, Environment para regras por alvo (aprovação em prod, secrets/vars próprios, URL): pack [deploy-environments.md](references/deploy-environments.md).
11. **Scan de segurança no PR** — três camadas: segredos (gitleaks sobre o diff), dependências (audit falhando em high+) e SAST (Semgrep/CodeQL): pack [security-scanning.md](references/security-scanning.md). Falso positivo se suprime no arquivo da ferramenta com motivo — nunca silenciando o job.

## Não faça

- ❌ `uses: terceiro/action@v3` (tag mutável) com secrets no job → ✅ pin por SHA + comentário da versão
- ❌ AWS/Azure key de longa duração em secret → ✅ OIDC com `id-token: write`
- ❌ `run: echo "${{ github.event.issue.title }}"` → ✅ via `env:` (injeção de script)
- ❌ Deploy de produção sem Environment/aprovação → ✅ `environment: production` com protection rule
- ❌ Workflow copiado entre repos → ✅ `workflow_call` reutilizável
- ❌ `continue-on-error` para calar um scanner → ✅ supressão pontual no arquivo da ferramenta, com motivo

## Quando ler o quê

- [deploy-environments.md](references/deploy-environments.md) — blueprint completo de deploy multi-ambiente: `strategy.matrix` × GitHub Environments, protection rules, secrets/vars por ambiente, `environment.url`. Leia ao montar qualquer pipeline de deploy.
- [deploy-checklist.md](references/deploy-checklist.md) — runbook de release com risco (migração, contrato novo): pré/durante/pós com gatilhos de rollback decididos ANTES, com números. Leia antes de um deploy fora da rotina.
- [security-scanning.md](references/security-scanning.md) — as três camadas de scan (segredos/SCA/SAST) com snippets prontos, instalação com checksum e a disciplina de supressão. Leia ao montar ou endurecer o CI de um repo.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
