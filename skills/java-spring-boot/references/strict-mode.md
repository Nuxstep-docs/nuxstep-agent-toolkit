# Modo Estrito — Java & Spring Boot

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **ArchUnit como gate de CI** — as regras de camada (domínio sem Spring/JPA/HTTP; adapters isolados) rodam em toda build; violação falha o PR.
2. **Cobertura 80% em domínio/use cases** via JaCoCo, com verificação na build (herda `tdd` strict).
3. **Testcontainers obrigatório** para persistência e mensageria no CI — H2/mock de banco não conta como prova.
4. **Null-safety total** — JSpecify `@NullMarked` em todos os pacotes + verificação estática (NullAway/Error Prone) na build.
5. **Contrato OpenAPI versionado** — springdoc gerado na build e commitado; mudança de contrato é diff revisável.
6. **Análise estática como gate** — Error Prone + Checkstyle (ou config SonarQube) com zero issues novas; supressão exige justificativa no código.
7. **Migrations com revisão de DBA-mind** — Flyway/Liquibase com checklist: índice para FK nova, lock-safety em `ALTER` de tabela grande (skill `postgresql` strict).
