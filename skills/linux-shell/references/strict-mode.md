# Modo Estrito — Linux & Shell

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **shellcheck como gate de CI** — todo `.sh` do repo lintado; warning = falha.
2. **bats para scripts críticos** — script de deploy/backup/migração tem teste (bats-core) cobrindo o caminho feliz e falhas de pré-condição.
3. **Provisionamento como código** — servidor configurado por Ansible/Terraform (skills correspondentes), não à mão; o runbook vira playbook, e o servidor é reconstruível.
4. **Acesso auditado** — chaves SSH inventariadas com dono e prazo de revisão; `sudo` logado (journald) e revisado em cadência; conta compartilhada proibida.
5. **Hardening verificado por ferramenta** — Lynis (ou equivalente) agendado com score mínimo; drift de configuração alerta.
6. **Backups do servidor testados** — restore ensaiado por trimestre; segredo de backup fora do próprio servidor.
