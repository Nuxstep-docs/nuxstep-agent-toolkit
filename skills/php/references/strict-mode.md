# Modo Estrito — PHP

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **PHPStan nível máximo (9/10) com baseline zerada** em código novo; baseline existente só diminui.
2. **Pint/PHP-CS-Fixer como gate de CI** — diff de formatação falha a build.
3. **Cobertura 80% no domínio** (Pest `--coverage`; herda `tdd` strict); mutation testing (Infection) nos módulos críticos.
4. **`composer audit` no CI** — vulnerabilidade conhecida bloqueia merge; dependências com versão fixada pelo lock.
5. **Arquitetura verificada** — deptrac para regras de camada (domínio sem framework), conforme skill `software-architecture`.
6. **Tipos totais** — propriedade/retorno sem tipo é erro de lint; `mixed` exige justificativa em comentário.
