# Modo Estrito — Arquitetura

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Regras de dependência verificadas por ferramenta** — ArchUnit (Java), dependency-cruiser (TS/JS), import-linter (Python) rodando no CI; a regra "domínio não importa framework" vira teste, não convenção.
2. **Hexágono completo obrigatório** em todo serviço com regra de negócio — a escada da dose certa para no último degrau; exceção exige ADR.
3. **Desvio arquitetural = ADR antes do merge** — qualquer dependência nova entre camadas, atalho ou acoplamento deliberado é registrado em `specs/adr/` com motivo e prazo de revisão.
4. **Mapeamento domínio ↔ persistência explícito** — entidade do ORM nunca é a entidade do domínio; mapper no adapter (MapStruct, funções puras), mesmo quando os campos coincidem hoje.
5. **Efeitos indeterminísticos atrás de ports** — relógio (`Clock`), UUID e random injetados como ports, nunca chamados direto no domínio (testes determinísticos).
6. **Revisão de dependências no PR** — adicionar biblioteca que o domínio importaria é bloqueante; dependência nova entra por adapter.
