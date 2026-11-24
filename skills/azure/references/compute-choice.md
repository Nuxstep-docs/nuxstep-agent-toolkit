# Azure — escolha de compute (escada da dose certa)

Comece pelo degrau mais simples que atende; subir depois é barato, descer é projeto.

| Workload | Serviço | Por quê / custo típico |
|---|---|---|
| Site estático, SPA, Next.js estático | **Static Web Apps** | CDN + TLS + preview de PR grátis/na faixa free; zero servidor |
| Next.js SSR / API Node/PHP simples | **Container Apps** (ou App Service se o time preferir PaaS clássico) | Scale-to-zero = custo ~zero ocioso; degrau padrão para containers |
| Microsserviços, MCP servers, APIs | **Container Apps** | Revisões, ingress gerenciado, KEDA para escala por fila/evento |
| Tarefa por evento (webhook, fila, cron) | **Functions** (consumption) | Paga por execução; nada ocioso |
| Job agendado/batch | **Container Apps Jobs** | Mesmo modelo de container, execução sob demanda |
| Muitos serviços + requisitos de malha/operador | **AKS** — só com ADR | Poder total, custo de operação alto (upgrades, nodes, rede) |
| Software de prateleira/legado que exige SO | **VM** — último recurso | Você vira o responsável por patch/backup/hardening (skill `linux-shell`) |

## Sinais de que é hora de subir de degrau

- Container Apps → AKS: precisa de daemonset/operador próprio, rede custom (CNI), ou dezenas de serviços com requisitos que o ACA não expõe.
- Functions → Container Apps: cold start dói no caminho crítico, ou a função virou aplicação (dependências pesadas, execução longa).
- SWA → Container Apps: o "site" ganhou backend de verdade.

## Regras transversais

1. Todo serviço do projeto no MESMO resource group do ambiente (ciclo de vida).
2. Scale-to-zero habilitado onde latência de cold start é aceitável (interno, filas); mínimo 1 réplica onde não é (API de cliente).
3. Custo estimado ANTES de criar (pricing calculator) e budget no RG — a tool MCP `get_approved_stack` indica o padrão vigente.
