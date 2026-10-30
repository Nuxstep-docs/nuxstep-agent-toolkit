---
name: incident-response
description: >-
  Processo da Nuxstep para resposta a incidentes: classificar severidade
  (SEV1–4), mitigar antes de diagnosticar, comunicar com cadência fixa,
  timeline desde o primeiro minuto e postmortem blameless com action items.
  Use quando algo estiver fora do ar ou degradado em produção, um alerta
  disparar, o cliente reportar indisponibilidade, ou ao escrever
  postmortem/status de incidente — também em pedidos implícitos como "o site
  caiu", "produção está lenta", "deu ruim no deploy" ou "o que aconteceu
  ontem?".
license: Proprietary
metadata:
  globs: "**/runbook*/**,**/postmortem*.md,**/incident*.md"
  category: ops
  visibility: "public"
---

# Resposta a Incidentes

Do alerta ao postmortem. Objetivo nº 1 durante o incidente: **restaurar o serviço** — causa-raiz vem depois, com evidência preservada. Runbooks específicos de stack (ex.: WordPress invadido) vivem nas skills da stack; este é o processo comum a todos.

1. **Classifique a severidade antes de agir** — SEV1 (serviço fora, todos afetados: resposta imediata) a SEV4 (cosmético: próximo dia útil) — tabela completa no pack [templates.md](references/templates.md). Na dúvida entre dois níveis, assuma o mais alto: rebaixar depois é barato, escalar tarde é caro.
2. **Papéis explícitos, mesmo em equipe de um** — quem comanda a resposta e quem comunica são chapéus distintos; vista um de cada vez, conscientemente. Em projeto de cliente, a comunicação com o cliente é papel do processo, não improviso no meio da pressão.
3. **Mitigar vence diagnosticar** — rollback (`git revert`/ArgoCD — skill `argocd`), feature flag off, scale up: restaure primeiro. **Preserve a evidência antes de mexer** (logs, snapshot, estado do processo) — a investigação depende dela.
4. **Timeline desde o minuto um** — registre `horário → evento/ação` enquanto acontece, em fuso fixo (UTC). Reconstruir de memória depois produz ficção; o postmortem nasce desta tabela.
5. **Comunicação factual com cadência fixa** — update em intervalo prometido (SEV1: ~30 min) com quatro itens: o que sabemos, quem é afetado, o que estamos fazendo, quando sai o próximo update. Sem especulação de causa nem promessa de prazo que não é seu.
6. **Resolvido ≠ encerrado** — status segue Investigando → Identificado → Monitorando → Resolvido; só declare Resolvido depois da janela de monitoramento com o alerta original de volta ao verde (skills `prometheus`/`grafana`).
7. **Postmortem blameless obrigatório em SEV1/SEV2** — foco em sistemas e processos, nunca em pessoas (culpa esconde informação); 5 porquês até a causa sistêmica; **action items com dono, prioridade e prazo** — postmortem sem action item é desabafo.
8. **Aprendizado vira regra** — action item que se repete entre incidentes vira alerta, runbook ou skill no hub; incidente que não muda nada vai se repetir.

## Não faça

- ❌ Caçar causa-raiz com produção fora do ar → ✅ mitigue (rollback/flag), investigue depois
- ❌ "Já deve estar voltando" para o cliente → ✅ update factual + horário do próximo update
- ❌ Mexer no servidor antes de capturar evidência → ✅ logs/snapshot primeiro, mesmo sob pressão
- ❌ Postmortem que aponta culpado → ✅ blameless: o que no processo permitiu o erro
- ❌ Action item sem dono e prazo → ✅ tabela dono/prioridade/data, revisada depois
- ❌ Encerrar no primeiro sinal verde → ✅ janela de monitoramento antes de Resolvido

## Quando ler o quê

- [templates.md](references/templates.md) — tabela SEV1–4 com tempos de resposta, template de status update e template de postmortem (5 porquês, action items). Leia ao abrir um incidente ou escrever o postmortem.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
