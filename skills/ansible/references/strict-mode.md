# Modo Estrito — Ansible

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Molecule para toda role compartilhada** — teste em container/VM provando convergência E idempotência (segunda execução com zero changed).
2. **ansible-lint como gate de CI** com profile `production`; warning = falha.
3. **Execução só via pipeline** — produção aplicada pelo CI/AWX/Semaphore com log auditável; execução da máquina do dev é exceção registrada.
4. **`--check --diff` automático no PR** — o diff do que mudaria em produção aparece na revisão antes do merge.
5. **Inventário dinâmico para nuvem** — plugin de inventory (azure/aws) em vez de IPs hardcoded; host órfão é drift visível.
6. **Rotação da senha do Vault** documentada e ensaiada; segredos re-criptografados na troca.
