# Modo Estrito — Python

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Cobertura mínima acordada** — alvo definido no projeto (ex.: 80% com branch coverage) via `pytest --cov`; função pública sem teste bloqueia merge.
2. **ruff em `select = ["ALL"]`** — com ignores explícitos e justificados no `pyproject.toml`; regra desligada sem motivo escrito é achado.
3. **pyright em modo `strict`** — nas pastas de código novo; legado entra gradualmente por diretório.
4. **Property-based testing** — hypothesis nas funções de lógica pura com domínio de entrada rico (parsers, cálculos, normalizações).
5. **Cadeia de suprimentos** — `pip-audit`/`uv audit` no CI; cooldown de ~14 dias para versões recém-publicadas (mitiga pacote comprometido); Dependabot ligado (ecosystems pip e github-actions).
6. **Scripts PEP 723 com `exclude-newer` obrigatório** — script sem data de congelamento é build irreprodutível.
7. **Segredos e config** — leitura de env centralizada num módulo de config validado (pydantic-settings ou equivalente); `os.environ` espalhado é achado.
