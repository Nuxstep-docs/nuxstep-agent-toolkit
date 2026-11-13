# Modo Estrito — DigitalOcean

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Tudo via Terraform** — inclusive firewalls, VPCs e Spaces; painel é somente leitura em produção.
2. **Droplets com hardening verificado** — runbook linux-shell aplicado + auditoria (Lynis) em cadência; unattended-upgrades comprovado.
3. **Monitoramento externo** — uptime + alertas da DO complementados por monitoração própria (skill `prometheus`/agente) com retenção.
4. **Restore do Managed DB ensaiado por trimestre**; snapshots de Droplet com política de retenção escrita.
5. **Acesso por time** — DO Teams com membros individuais e 2FA; token de API com escopo/validade mínimos, rotacionado.
