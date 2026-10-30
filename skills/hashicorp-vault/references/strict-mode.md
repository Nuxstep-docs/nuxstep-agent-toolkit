# Modo Estrito — Vault

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Zero segredos estáticos onde existe backend dinâmico** — DB/nuvem só com credenciais efêmeras; estático remanescente tem ADR com plano de migração.
2. **Policies como código** — HCL versionado e aplicado por pipeline (terraform provider); mudança de policy é PR revisado.
3. **Auditoria centralizada e alertada** — audit log drenado para o SIEM/log central; leitura anômala (caminho fora do padrão do serviço, volume) alerta.
4. **Rotação automatizada** — rotation jobs/engines para os estáticos restantes; prazo vencido abre issue automaticamente.
5. **DR ensaiado por trimestre** — restore do snapshot + unseal em ambiente limpo, com tempo medido (RTO real, não teórico).
6. **Break-glass documentado** — procedimento de emergência (root token selado, quóruns de unseal) escrito, testado e com trilha.
