---
name: digitalocean
description: >-
  Padrões da Nuxstep para DigitalOcean: App Platform antes de Droplet, Managed
  Databases, Spaces sem acesso público, Cloud Firewalls default-deny e IaC com
  doctl/terraform. Use ao hospedar ou revisar projetos na DO — também em
  pedidos implícitos como "sobe num droplet", "hospeda barato esse projeto" ou
  "configura o banco na DO".
license: Proprietary
metadata:
  globs: "**/*.tf,**/.do/**,app.yaml"
  category: cloud
  visibility: "public"
---

# DigitalOcean

Padrões para DO (serviços vigentes: tool MCP `get_approved_stack`). **Papel**: a nuvem simples e custo-previsível para projetos pequenos/médios (incl. projetos de amigos/família); quando o projeto exigir serviços gerenciados avançados, o degrau seguinte são as skills `azure`/`aws`. IaC obrigatório (skill `terraform` — provider DO; `doctl` para operações).

1. **Escada de compute** — App Platform primeiro (deploy do git/container, TLS e escala resolvidos); **Droplet só quando App Platform não serve** — e aí o SO é seu: runbook `server-setup` da skill `linux-shell` é obrigatório, do SSH ao fail2ban; DOKS segue a regra de Kubernetes gerenciado: só com ADR.
2. **Banco é Managed Database** — Postgres/MySQL/Redis gerenciados (backup, failover e patch inclusos); banco dentro de Droplet "para economizar" é assumir papel de DBA 24/7 — exige ADR. Ligue **trusted sources** (firewall do banco: só os apps conectam).
3. **Spaces com a disciplina do S3** — bucket privado por padrão; público só via CDN embutido/URL assinada; mesma regra da skill `aws`.
4. **Cloud Firewall default-deny em todo Droplet** — só as portas servidas; SSH restrito (idealmente ao seu IP/VPN).
5. **VPC por projeto** — tráfego app↔banco pela rede privada, nunca pelo IP público.
6. **Projects + tags + alerta de billing** — recursos agrupados por projeto com dono; alerta de fatura configurado (a previsibilidade da DO só vale se alguém olha).
7. **Backups habilitados** — snapshots/backups automáticos em Droplets; restore do Managed DB ensaiado (backup não testado é hipótese).

## Não faça

- ❌ Banco de produção dentro do Droplet → ✅ Managed Database (ou ADR assumindo o custo operacional)
- ❌ Droplet sem Cloud Firewall/na rede pública → ✅ default-deny + VPC
- ❌ Spaces público "para servir as imagens" → ✅ CDN/URL assinada
- ❌ Droplet provisionado sem o runbook linux-shell → ✅ server-setup completo
- ❌ Produção criada no painel → ✅ terraform/doctl

## Quando ler o quê

- Skill `linux-shell` → [server-setup.md](../linux-shell/references/server-setup.md) — obrigatório para qualquer Droplet.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
