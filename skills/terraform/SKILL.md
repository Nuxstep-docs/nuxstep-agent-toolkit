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
2. **Estrutura por ambiente** — `modules/` (reutilizáveis) + `environments/<env>/` instanciando-os; cada ambiente com state próprio. `terraform.tfvars` guarda só valores **puros** (`environment = "prod"`, `project_name = "backup-hosting01"`); **toda composição de nome acontece em `locals` do root** com convenção única `<project_name>-<env>` — nome composto é imutável na prática (renomear = destroy/recreate). Blueprint: [main.tf](references/main.tf).
3. **Disciplina de plan** — `apply` SÓ de um plan revisado (`terraform plan -out` → revisão → `apply plan.out`); em CI, o plan aparece no PR e o apply roda após merge/aprovação. `-auto-approve` interativo é bloqueado por hook do plugin.
4. **Módulo com contrato e sem mágica de nome** — `variables.tf` com `type`, `description` e `validation`; recurso nomeável recebe o **nome final por variável** (uma por recurso) e o usa **verbatim** — módulo nunca compõe nem deriva nomes; a `validation` impõe tamanho mín/máx e charset do recurso (falha no plan, não no apply). `outputs.tf` descritos; fonte fixada por versão (`?ref=v1.2.0`), nunca branch.
5. **Módulo cobre o domínio, stack cobre o projeto** — módulo de serviço gerenciado nasce com o ciclo completo do domínio desde a v1: ciclo de vida/retenção, criptografia, modelo de acesso/credenciais, exposição de rede e os outputs que a stack precisa para compor credenciais e monitoramento (output com credencial: `sensitive = true`). Cobrir só o happy path do primeiro consumidor cobra "mudança de domínio" a cada consumidor novo; necessidade específica de projeto fica na stack — só o intrínseco ao domínio entra no módulo.
6. **Tags FinOps em tudo** — `Environment`, `Project`, `CostCenter`, `Owner` via `default_tags` do provider (um lugar só), alinhado às skills `azure`/`aws`.
7. **Segredo nunca no código nem no state à toa** — sem default sensível em `variables.tf`, sem `.tfvars` commitado com segredo; valores vêm do cofre/CI (OIDC). Lembre: o que entra em atributo sensível ainda fica NO STATE — proteja o bucket como segredo.
8. **Qualidade mínima em todo repo** — `terraform fmt -check`, `validate` e `tflint` no CI; módulo compartilhado ganha `terraform test` (casos nativos) cobrindo o contrato.
9. **Import antes de recriar** — recurso que já existe entra via `import` block; destruir/recriar por preguiça de importar é incidente.
10. **Drift é sinal, não ruído** — plan agendado detectando divergência entre código e nuvem; drift achado = alguém fez ClickOps (corrija o processo, não só o state).

## Não faça

- ❌ `terraform apply -auto-approve` interativo → ✅ plan revisado → apply do arquivo de plan
- ❌ State local ou sem lock "por enquanto" → ✅ backend remoto com `use_lockfile` desde o init
- ❌ Módulo apontando para branch (`?ref=main`) → ✅ tag de versão
- ❌ Segredo em `.tfvars` commitado → ✅ cofre/variável de CI
- ❌ Editar recurso no console e "depois ajusto o tf" → ✅ código primeiro; console é leitura
- ❌ Módulo concatenando `-${var.env}` ou derivando sub-nomes → ✅ nome final chega por variável validada; composição só nos `locals` do root

## Quando ler o quê

- [main.tf](references/main.tf) — blueprint de backend com lock nativo, nomenclatura (tfvars puros → `locals` → módulo verbatim com `validation`) e tags. Consulte ao iniciar projeto/módulo.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
