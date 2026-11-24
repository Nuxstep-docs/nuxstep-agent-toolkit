---
name: grafana
description: >-
  Padrões da Nuxstep para dashboards no Grafana: dashboard responde uma
  pergunta, USE para infra e RED para serviço, variáveis em vez de cópias,
  dashboards como código (Git Sync/provisioning) e anotações de deploy. Use ao
  criar ou alterar dashboards, painéis ou visualizações de métricas — também em
  pedidos implícitos como "crie um dashboard para esse serviço", "quero
  visualizar essas métricas" ou "organiza esses painéis".
license: Proprietary
metadata:
  globs: "**/grafana/**,**/dashboards/**,**/*.json"
  category: observability
  visibility: "public"
---

# Grafana

Camada de visualização padrão do playbook (versão vigente: tool MCP `get_approved_stack`). As métricas vêm do Prometheus (skill `prometheus`); as **regras de alerta moram lá**, não no dashboard.

1. **Dashboard responde UMA pergunta** — se não dá para dizer em uma frase o que ele responde ("quais serviços estão degradados?"), ele não precisa existir. Layout do geral ao específico: overview em cima, drill-down abaixo/linkado.
2. **Dashboards como código** — JSON versionado e provisionado (Git Sync/provisioning/Terraform); edição manual em produção é rascunho, não fonte. O que não está versionado não existe.
3. **USE para infra, RED para serviço** — USE (Utilization/Saturation/Errors) mostra a saúde das máquinas (causas); RED (Rate/Errors/Duration) mostra a dor do usuário (sintomas). Alerta nasce de sintoma RED — nunca de um painel USE.
4. **Variáveis em vez de cópias** — `$datasource`, `$cluster`, `$app`: um dashboard parametrizado serve todos os serviços. Duplicar-e-mudar-uma-coisa é como nasce o sprawl.
5. **Cor com significado, eixo normalizado** — thresholds dão semântica consistente (verde=ok em TODO dashboard); métricas comparáveis normalizadas (CPU em %, não valor cru); stacking desligado por default (esconde dados).
6. **Anotações de deploy** — marque releases no gráfico (CI → API de annotations); correlacionar incidente com deploy é o primeiro passo de qualquer investigação.
7. **Todo painel se explica em segundos** — título que diz o que é, descrição no "i", Text panel com propósito/links no topo do dashboard. Quem lê às 3h da manhã não pode precisar de contexto.
8. **Dono e ciclo de vida** — dashboard tem dono identificável (tag/título); temporário leva prefixo `TMP:` e morre depois do uso; cópia é renomeada e **não** herda as tags do original.

## Não faça

- ❌ Editar dashboard de produção no navegador → ✅ mudança via código versionado (PR)
- ❌ Um dashboard por serviço/nó duplicado → ✅ variáveis de template
- ❌ Alerta nascendo de painel USE (CPU alta) → ✅ sintoma RED, regra no Prometheus
- ❌ Refresh de 5s em dado que muda a cada 1min → ✅ refresh na frequência do dado
- ❌ Copiar dashboard mantendo as tags → ✅ renomear, retag e linkar o original
- ❌ Painel que ninguém decifra sem perguntar → ✅ título claro + descrição no "i"

## Quando ler o quê

- [dashboard-design.md](references/dashboard-design.md) — princípios de design, USE/RED/Golden Signals em detalhe, modelo de maturidade e checklist de review.
- [as-code.md](references/as-code.md) — escada de dashboards-as-code: provisioning, Git Sync, Terraform e Foundation SDK — quando usar cada.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
