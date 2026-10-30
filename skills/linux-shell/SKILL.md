---
name: linux-shell
description: >-
  Padrões da Nuxstep para shell script (bash seguro: set -euo pipefail, quoting,
  shellcheck) e administração Linux (SSH só por chave, firewall default-deny,
  fail2ban, systemd, menor privilégio). Use ao escrever/revisar qualquer script
  .sh, automatizar tarefas no terminal, provisionar ou endurecer servidores —
  também em pedidos implícitos como "faz um script pra isso", "sobe um servidor
  novo", "o servidor está sofrendo brute-force".
license: Proprietary
metadata:
  globs: "**/*.sh,**/*.bash,**/systemd/**,**/etc/**"
  category: infra
  visibility: "public"
---

# Linux & Shell

## Shell script (bash)

1. **Prólogo obrigatório** — `#!/usr/bin/env bash` + `set -euo pipefail`; script que continua após erro silencioso é o bug mais caro do shell.
2. **Quote tudo** — `"$var"`, `"$@"`, `"$(cmd)"`; palavra sem aspas é split/glob acidental (causa nº 1 de bug). Lista = array bash, nunca string com espaços.
3. **shellcheck sempre** — é o compilador do shell; warning se resolve, não se ignora (shfmt para formato).
4. **Estruture** — funções pequenas com `local`; `trap 'cleanup' EXIT` para arquivos temporários/locks; `${VAR:?mensagem}` para exigir parâmetros.
5. **Portabilidade consciente** — usa bashismo? shebang bash, não `sh`. GNU vs. BSD/macOS divergem (`date -d` vs. `-v`, `sed -i`): declare o alvo ou trate os dois.
6. **Shell é cola, não aplicação** — passou de ~100 linhas com lógica/estruturas de dados, promova para Python/TypeScript; parsing de JSON é `jq`, nunca grep/sed.
7. **Scripts de setup são idempotentes** — rodar duas vezes não pode quebrar nem duplicar (crie com `-p`, cheque antes de adicionar, `--force` consciente).
8. **Operação longa desacoplada da sessão** — `nohup ... & tail -f` ou `systemd-run`; sessão SSH caindo não pode matar o trabalho (lição de caso real).

## Administração de servidor

9. **SSH só por chave** — `PasswordAuthentication no`, `PermitRootLogin prohibit-password` (ou `no` com usuário admin); brute-force em SSH exposto é tráfego de fundo constante da internet — caso real nosso confirmou.
10. **Firewall default-deny** — `ufw`/nftables negando entrada por padrão; abra SÓ o que o servidor serve.
11. **fail2ban + unattended-upgrades** — bloqueio automático de brute-force e patches de segurança automáticos: o mínimo para servidor que ninguém olha todo dia.
12. **Serviço = systemd unit** com usuário próprio sem sudo — nada de processo em `screen`/`nohup` como "deploy" nem serviço rodando como root.
13. **sudo específico** — drop-in em `/etc/sudoers.d/` (via `visudo -f`) com comandos exatos, nunca `ALL=(ALL) NOPASSWD: ALL` para contas de serviço.

## Não faça

- ❌ Script sem `set -euo pipefail` → ✅ prólogo sempre
- ❌ `$var` sem aspas / `for f in $(ls ...)` → ✅ `"$var"`, glob direto ou `while read -r`
- ❌ `curl ... | bash` de fonte não verificada → ✅ baixe, inspecione, confira hash, então execute
- ❌ SSH com senha "temporariamente" → ✅ chave desde o minuto 1 (runbook)
- ❌ Serviço como root por simplicidade → ✅ usuário dedicado + systemd

## Quando ler o quê

- [server-setup.md](references/server-setup.md) — **runbook de provisionamento**: usuário/sudoers, SSH hardening (sem se trancar fora), firewall, fail2ban, unattended-upgrades, systemd, verificação final. Leia ao subir ou endurecer qualquer servidor.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
