---
name: terraform
description: >-
  Padrões da Nuxstep para infraestrutura como código com Terraform/OpenTofu:
  estado remoto com lock nativo, estrutura por ambiente, módulos, tags FinOps,
  segredos fora do código e disciplina de plan. Use sempre que criar ou alterar
  arquivos .tf, módulos, state ou provisionar infraestrutura — também em
  pedidos implícitos como "provisiona esse recurso", "cria a infra do projeto"
  ou "o terraform está travado".
license: Proprietary
metadata:
  globs: "**/*.tf,**/*.tfvars,**/terraform/**"
  category: infra
  visibility: "public"
---

# Terraform

A infraestrutura da Nuxstep é puramente código: **se não está no Terraform, não existe** — alteração manual no console (ClickOps) é proibida. Versão vigente (e a opção OpenTofu, compatível e MPL): tool MCP `get_approved_stack`.

1. **Estado remoto com lock, sempre** — backend S3/Azure Blob com `encrypt`; no S3, **`use_lockfile = true`** (locking nativo, TF 1.11+; DynamoDB locking está deprecado — não monte infra nova com ele). Execuções simultâneas sem lock corrompem a nuvem.
2. **Estrutura por ambiente** — `modules/` (reutilizáveis) + `environments/<env>/` instanciando-os; cada ambiente com state próprio. Blueprint: [main.tf](references/main.tf).
3. **Disciplina de plan** — `apply` SÓ de um plan revisado (`terraform plan -out` → revisão → `apply plan.out`); em CI, o plan aparece no PR e o apply roda após merge/aprovação. `-auto-approve` interativo é bloqueado por hook do plugin.
4. **Módulo com contrato** — `variables.tf` com `type`, `description` e `validation`; `outputs.tf` descritos; module registry/fonte fixada por versão (`?ref=v1.2.0`), nunca branch.
5. **Tags FinOps em tudo** — `Environment`, `Project`, `CostCenter`, `Owner` via `default_tags` do provider (um lugar só), alinhado às skills `azure`/`aws`.
6. **Segredo nunca no código nem no state à toa** — sem default sensível em `variables.tf`, sem `.tfvars` commitado com segredo; valores vêm do cofre/CI (OIDC). Lembre: o que entra em atributo sensível ainda fica NO STATE — proteja o bucket como segredo.
7. **Qualidade mínima em todo repo** — `terraform fmt -check`, `validate` e `tflint` no CI; módulo compartilhado ganha `terraform test` (casos nativos) cobrindo o contrato.
8. **Import antes de recriar** — recurso que já existe entra via `import` block; destruir/recriar por preguiça de importar é incidente.
9. **Drift é sinal, não ruído** — plan agendado detectando divergência entre código e nuvem; drift achado = alguém fez ClickOps (corrija o processo, não só o state).

## Não faça

- ❌ `terraform apply -auto-approve` interativo → ✅ plan revisado → apply do arquivo de plan
- ❌ State local ou sem lock "por enquanto" → ✅ backend remoto com `use_lockfile` desde o init
- ❌ Módulo apontando para branch (`?ref=main`) → ✅ tag de versão
- ❌ Segredo em `.tfvars` commitado → ✅ cofre/variável de CI
- ❌ Editar recurso no console e "depois ajusto o tf" → ✅ código primeiro; console é leitura

## Quando ler o quê

- [main.tf](references/main.tf) — blueprint de backend com lock nativo + módulo com tags. Consulte ao iniciar projeto/módulo.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
