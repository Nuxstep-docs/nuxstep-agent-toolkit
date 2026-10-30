# Modo Estrito — TDD

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **TDD obrigatório em toda regra de negócio** — commit de código de domínio/use case sem o teste correspondente no mesmo commit é reprovável em review.
2. **Cobertura mínima como gate de CI** — 80% em domínio e use cases (linhas e branches); bordas/adapters ficam de fora da meta para não incentivar teste de implementação.
3. **Proibido `skip`/`only` em commit** — teste pulado é dívida invisível; o CI falha se encontrar (`--forbid-only`/lint do runner).
4. **Testes de integração reais para persistência e mensageria** — Testcontainers (ou equivalente) no CI; mock de banco não conta como prova.
5. **Testes de arquitetura** — regras de dependência entre camadas verificadas por ferramenta (ArchUnit, dependency-cruiser) conforme a skill da stack.
6. **Suíte rápida é requisito** — unidade < 1s por teste; o que passar disso vai para a camada de integração. Suíte lenta mata o ciclo RED-GREEN.
