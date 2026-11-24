# Modo Estrito — Terraform

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Pipeline de plan/apply formal** — plan postado no PR (comentário automático), apply só via CI após aprovação; credencial de apply existe apenas no CI (OIDC), nenhum humano aplica da máquina local.
2. **Policy as code** — tfsec/trivy + OPA/Sentinel (ou checkov) como gate: recurso público, sem criptografia ou sem tags é negado no CI, não em review.
3. **`terraform test` obrigatório em módulo compartilhado** — contrato (variables/outputs) e casos de uso principais cobertos; módulo sem teste não entra no registry interno.
4. **Drift detection agendada com alerta** — plan noturno; divergência abre issue automaticamente.
5. **State com acesso mínimo e versionado** — bucket com versioning + retenção; leitura do state restrita (contém dados sensíveis); acesso auditado.
6. **Upgrades deliberados** — provider/versão do Terraform fixados (`required_version`, `required_providers` com `~>`); upgrade é PR próprio com changelog lido, nunca efeito colateral.
