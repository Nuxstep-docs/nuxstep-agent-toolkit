# Modo Estrito — GitHub Actions

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **100% das actions de terceiros pinadas por SHA** com Dependabot gerenciando — lint de workflow (actionlint + zizmor/pinact) no CI falhando com tag mutável.
2. **OIDC obrigatório** — nenhum secret de nuvem de longa duração no repo; exceção exige ADR com plano de rotação.
3. **Allowlist de actions** na organização (Settings → Actions): só actions internas, oficiais e aprovadas caso a caso.
4. **`pull_request_target` proibido** sem revisão de segurança registrada — é o vetor clássico de exfiltração por fork.
5. **Artefatos de release com atestado** — `actions/attest-build-provenance` (SLSA) nos builds publicados.
6. **Orçamento de pipeline** — duração do CI de PR monitorada; estouro recorrente vira issue de infra (cache/paralelização), não espera aceita.
7. **Scanners como checks obrigatórios** — as três camadas (segredos, SCA, SAST do pack `security-scanning.md`) bloqueiam merge via ruleset; supressões (`.gitleaksignore`, `nosemgrep`, allowlists) auditadas periodicamente — supressão sem motivo escrito é achado.
8. **Cadeia de suprimentos endurecida** — binário de tooling só com checksum conferido (`sha256sum --check --strict`); imagem Docker por digest; tooling Python com `pip --require-hashes`; imagem de produção escaneada (Trivy) antes do push ao registry.
