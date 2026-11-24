# OCI — escolha de compute (escada da dose certa)

Comece pelo degrau mais simples que atende; subir depois é barato, descer é projeto.

| Workload | Serviço | Por quê / custo típico |
|---|---|---|
| Site estático, SPA, assets | **Object Storage** (+ CDN na frente) | Zero servidor; bucket privado com CDN/PAR servindo |
| API/serviço em container | **Container Instances** | Serverless: paga só CPU/memória alocadas (mesmo preço do Compute), sem nó para operar |
| Tarefa por evento (webhook, fila, cron) | **Functions** | Paga por execução; nada ocioso |
| Muitos serviços + requisitos de malha/operador | **OKE** — só com ADR | Kubernetes gerenciado; a orquestração precisa pagar o próprio custo de operação |
| Hospedagem/software que exige SO (DirectAdmin, legado) | **VM Ampere Flex** — escolha consciente | ARM com melhor custo/benefício da nuvem; você vira dono de patch/backup/hardening (skills `linux-shell`/`directadmin`) |

Na OCI a VM não é "último recurso" como nas outras nuvens do playbook: o preço do shape
Ampere Flex é o motivo de a linha de hospedagem estar aqui. A regra é ser dono do SO
**por decisão**, nunca por inércia.

## Sinais de que é hora de subir de degrau

- Container Instances → OKE: precisa de service mesh/operador próprio, dezenas de
  serviços com deploy coordenado, ou escala por métrica custom que o CI não expõe.
- Functions → Container Instances: cold start dói no caminho crítico ou a função virou
  aplicação (dependências pesadas, execução longa).
- VM avulsa → padrão `directadmin`/automação: segunda VM com o mesmo papel é o sinal de
  codificar o padrão (manifesto + IaC), não de repetir à mão.

## Especificidades OCI a considerar antes de escolher

- **Porta 25 de saída bloqueada por padrão** — e-mail direto exige chamado por região +
  PTR, ambos só em conta paga (detalhe no pack `email.md` da skill `directadmin`).
- **Capacidade ARM concorrida** — shapes A1/Ampere podem ficar sem capacidade na
  região/AD; produção não pode depender de conseguir a VM "na hora" (reserve ou tenha
  plano B de shape).
- **Limites de serviço por tenancy/região** — confira os service limits antes de
  prometer topologia; aumento é chamado.
- **Always Free** — bom para experimento pessoal; as cotas mudam por decisão da Oracle
  (reduzidas em 2026) e recurso acima da cota pode ser desligado. Nunca produção.

## Regras transversais

1. Todo recurso do projeto no compartment do ambiente (policy, budget e organização
   acompanham).
2. Custo estimado ANTES de criar (cost estimator) e budget no compartment — a tool MCP
   `get_approved_stack` indica o padrão vigente; sem ela, siga o manifesto do servidor
   mais recente.
3. Multi-AD/região conforme o SLA que o cliente paga — nem mais, nem menos.
