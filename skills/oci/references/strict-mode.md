# Modo estrito

Regras adicionais quando o projeto declara `Rigor do projeto: strict`. Tenancy com
clientes pagantes é candidato natural.

1. **Security Zones nos compartments de produção** — política preventiva (bucket público
   e recurso sem criptografia nem chegam a nascer), não só detecção.
2. **Conformidade CIS OCI Foundations Benchmark auditada** — Cloud Guard com meta CIS +
   verificação periódica registrada; desvio aceito vira exceção documentada com prazo.
3. **Federação obrigatória no CI** — API key de usuário em pipeline é não conformidade;
   só identidade de workload federada com token de sessão curto.
4. **Landing zone como código** — hierarquia de compartments, policies, rede hub-spoke e
   guardrails provisionados por IaC versionado (nunca montados à mão no tenancy).
5. **Multi-AD/região com teste** — produção com redundância conforme SLA **e** failover
   exercitado (game day), não só desenhado.
6. **Auditoria e retenção estendidas** — Audit do tenancy retido conforme requisito
   (export para storage imutável quando o prazo exceder o padrão); revisão trimestral de
   custo com right-sizing baseado em métricas, achados no manifesto/ADR do projeto.
