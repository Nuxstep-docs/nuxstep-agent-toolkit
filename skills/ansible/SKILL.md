---
name: ansible
description: >-
  Padrões da Nuxstep para automação com Ansible: idempotência real, roles
  modulares, FQCN, Vault para segredos, check mode antes de aplicar e
  ansible-lint. Use sempre que criar ou alterar playbooks, roles ou inventários
  — também em pedidos implícitos como "automatiza a configuração desses
  servidores", "aplica isso em todos os hosts" ou "o playbook quebrou".
license: Proprietary
metadata:
  globs: "**/*.yml,**/*.yaml,**/inventory/**,**/roles/**,ansible.cfg"
  category: infra
  visibility: "public"
---

# Ansible

Padrões para automação de configuração (versão vigente: tool MCP `get_approved_stack`). Para infraestrutura de NUVEM (criar recursos), o lugar é a skill `terraform`; Ansible configura o que existe.

1. **Idempotência real** — rodar 100 vezes = mesmo estado. Prefira módulos nativos (idempotentes por construção); `shell`/`command` são exceção e exigem `creates:`/`changed_when:` para não mentir no relatório de mudanças.
2. **FQCN sempre** — `ansible.builtin.copy`, `community.postgresql.postgresql_db`; nome curto quebra conforme collections evoluem. Collections fixadas em `requirements.yml` com versão.
3. **Tudo em roles** — estrutura padrão (`tasks/`, `defaults/`, `handlers/`, `templates/`); playbook é orquestração fina de roles, não uma lista de 200 tasks.
4. **Variáveis com namespace** — `nginx_worker_count`, nunca `worker_count` (colisão entre roles); defaults em `defaults/`, overrides por inventário/grupo.
5. **Segredo só no Vault** — `ansible-vault` (ou lookup para cofre externo — skill `hashicorp-vault`); senha em var plana commitada é vazamento. Senha do vault vem do CI/keychain, nunca de arquivo no repo.
6. **Check antes de apply** — `--check --diff` como hábito (e obrigatório em produção); mudança inesperada no diff = pare e entenda.
7. **Inventário por ambiente** — `inventories/<env>/` com grupos; nunca um inventário único com ifs; `--limit` consciente para escopo reduzido.
8. **Handlers para reinício** — serviço reinicia por handler notificado (só quando algo mudou), não por task incondicional que derruba produção a cada run.
9. **ansible-lint limpo** — é o shellcheck do Ansible; roda no CI.
10. **Fatos e templates honestos** — templates Jinja com `| mandatory`/defaults explícitos; template que renderiza vazio silenciosamente é incidente futuro.

## Não faça

- ❌ `shell: apt install x` → ✅ módulo nativo (`ansible.builtin.apt`)
- ❌ `command:` sem `creates:`/`changed_when:` → ✅ idempotência declarada
- ❌ Senha em `group_vars` plano → ✅ ansible-vault/cofre
- ❌ `restart` incondicional de serviço → ✅ handler notificado por mudança
- ❌ Aplicar em produção sem `--check --diff` prévio → ✅ diff revisado primeiro

## Quando ler o quê

- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
