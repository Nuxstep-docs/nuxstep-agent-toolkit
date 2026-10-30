# Modo Estrito — NestJS

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Fronteiras verificadas por ferramenta** — dependency-cruiser no CI: domínio não importa `@nestjs/*` nem ORM; adapters não importam uns aos outros.
2. **Contrato OpenAPI versionado** — `@nestjs/swagger` gerado no build e commitado; mudança de contrato aparece no diff do PR e segue versionamento da API.
3. **e2e obrigatório por módulo** — todo módulo com controller tem suíte e2e (feliz + erros de contrato) rodando no CI com Testcontainers.
4. **Timeout global** — interceptor de timeout por request (com orçamento menor para chamadas externas); requisição sem teto é vazamento de recurso.
5. **Segurança de borda explícita** — `helmet`, CORS allowlist (nunca `*` com credenciais) e limites de payload configurados e revisados em PR.
6. **Cobertura 80% em domínio/use cases** (herda do `tdd` strict) + lint `typescript` strict ativo.
