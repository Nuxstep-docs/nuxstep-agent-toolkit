# Modo Estrito — AWS

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Organizations + SCPs** — conta por ambiente, com Service Control Policies barrando regiões não usadas e ações perigosas (deny por política, não convenção).
2. **IAM Access Analyzer ativo** — achados de acesso externo tratados em cadência; policy nova passa por validação (`iam:PolicyValidation`/cfn-lint-sec) no CI.
3. **Zero access keys de usuário** — Identity Center para humanos, roles+OIDC para máquinas; chave existente tem plano de extinção.
4. **CloudTrail em todas as contas** com log centralizado e imutável (S3 + object lock); GuardDuty ligado e triado.
5. **DR com RTO/RPO definidos e ensaiados** — restore de RDS e failover testados por trimestre.
6. **Revisão mensal de custo** — Cost Explorer por tag; recurso órfão (sem dono/tráfego) removido; anomalia investigada.
