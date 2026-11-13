---
name: oci
description: >-
  Governança e padrões da Nuxstep para Oracle Cloud Infrastructure (OCI), a
  nuvem da linha de hospedagem: escada de compute na dose certa (Container
  Instances antes de OKE; VM Ampere como escolha consciente), compartments
  planejados, instance principals/federação em vez de chaves, NSGs, Object
  Storage privado, tags FinOps e budgets. Use sempre que desenhar topologia,
  criar/revisar recursos OCI ou decidir hospedagem na Oracle — também em
  pedidos implícitos como "sobe isso na OCI", "cria a VM do hosting", "quanto
  custa na Oracle" ou "configura a rede do tenancy".
license: Proprietary
metadata:
  globs: "**/*.tf,**/oci/**"
  category: cloud
  visibility: "public"
---

# Oracle Cloud (OCI)

Padrões para a OCI — a nuvem da **linha de hospedagem** da Nuxstep (a preferencial do
playbook segue Azure; a OCI entra onde o custo/benefício ARM decide — serviços vigentes:
tool MCP `get_approved_stack`). Infra nasce de IaC (skill `terraform`); ClickOps em
produção é proibido.

1. **Compute pela escada da dose certa** — estático → Object Storage (+ CDN); serviço em
   container → **Container Instances** (serverless, paga só CPU/memória alocadas);
   evento/cron → Functions; **OKE só com ADR** (orquestração tem que pagar o próprio
   custo). VM (shapes Ampere Flex) é escolha **consciente** quando queremos ser donos do
   SO — caso da hospedagem (skills `linux-shell`/`directadmin`). Tabela:
   [compute-choice.md](references/compute-choice.md).
2. **Compartment planejado antes, nada no root** — a hierarquia de compartments é o eixo
   de policy, budget e organização; migrar depois é retrabalho. Um compartment por
   projeto, filhos por ambiente (ou o inverso — documentado); o root fica vazio de
   recursos.
3. **Conta paga + budget no dia 1** — trial apaga os recursos no fim do período (lição de
   casa) e as cotas do Always Free **mudam e encolhem** por decisão da Oracle: produção
   nunca depende de recurso Always Free. Budget com alerta em 80%/100% por compartment.
4. **Tags FinOps obrigatórias** — defined tags com namespace (`Environment`, `Project`,
   `CostCenter`, `Owner`) em todo recurso; free-form tag não tem governança. Mesma regra
   da skill `terraform`.
5. **Identidade de workload antes de chave** — serviço↔serviço por **instance
   principal** (dynamic group) ou resource principal; CI por federação de identidade de
   workload (token de sessão curto) quando disponível; API key de usuário é último
   recurso: dedicada, escopo mínimo e rotacionada. Segredo restante vive no OCI Vault.
6. **IAM por grupo, verbo na dose** — policies declarativas (`Allow group X to <verbo> Y
   in compartment Z`) sempre para grupos, nunca usuário individual; escolha o menor verbo
   que serve (`inspect` → `read` → `use` → `manage`); `manage all-resources in tenancy`
   só em break-glass documentado.
7. **NSG antes de Security List; dados em subnet privada** — NSG acompanha o recurso;
   Security List é da subnet e engorda até virar risco. Banco e storage sem IP público;
   acesso administrativo via Bastion. Regra de rede: porta **só no Destination Port
   Range** (preencher o Source abre todas as portas) e a lista precisa estar **anexada à
   subnet**.
8. **Object Storage privado por padrão** — acesso externo por pre-authenticated request
   com expiração ou CDN na frente; bucket público é decisão documentada, não default.
9. **Backup imutável e com retenção** — bucket cujo propósito é backup ganha **retention
   rule** (travada depois de validado o ciclo) e lifecycle policy (arquivamento/expiração)
   desde a criação; backup que uma credencial vazada consegue apagar não é backup.
10. **Postura e observabilidade ligadas** — Cloud Guard ativo no tenancy com metas
   alinhadas ao CIS OCI Foundations Benchmark (achado se trata, não se silencia);
   Monitoring + Logging com retenção definida; alarmes nos sinais que acordam alguém;
   Audit do tenancy preservado.

## Não faça

- ❌ Criar recurso de produção no console "rapidinho" → ✅ IaC (terraform) sempre
- ❌ Produção em conta trial ou recurso Always Free → ✅ conta paga + budget antes do primeiro cliente
- ❌ API key de usuário em serviço/CI → ✅ instance principal / federação; chave só como último recurso rotacionado
- ❌ Porta preenchida no Source Port Range da regra → ✅ porta só em Destination
- ❌ Security List engordando a cada serviço novo → ✅ NSG por recurso
- ❌ OKE para meia dúzia de containers → ✅ Container Instances (degrau certo)

## Quando ler o quê

- [compute-choice.md](references/compute-choice.md) — tabela de decisão de hospedagem OCI (Object Storage, Container Instances, Functions, OKE, VM Ampere) com sinais de upgrade de degrau e especificidades da OCI (porta 25, PTR, capacidade ARM). Leia ao decidir onde hospedar qualquer workload.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
