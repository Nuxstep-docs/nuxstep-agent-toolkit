# Projeto Python (uv + pyproject)

Para o que passou de script: pacote, CLI distribuída ou serviço.

## Fluxo

```bash
uv init --package meu-projeto   # layout src/ + pyproject
cd meu-projeto
uv add httpx                    # dependência de runtime
uv add --dev pytest ruff pyright
uv run pytest                   # tudo roda via uv run — nunca ative o venv à mão
```

`uv.lock` é **versionado**; CI instala com `uv sync --locked` (falha se o lock divergir do pyproject — drift não passa).

## `pyproject.toml` padrão-ouro (trechos que importam)

```toml
[project]
name = "meu-projeto"
requires-python = ">=3.11"
dependencies = ["httpx"]

[dependency-groups]            # PEP 735 — grupos de dev fora do pacote publicado
dev = ["pytest", "ruff", "pyright"]

[tool.ruff]
line-length = 100

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]  # essencial; "ALL" é modo estrito

[tool.pytest.ini_options]      # ATENÇÃO: [tool.pytest] (sem ini_options) não existe
testpaths = ["tests"]           # e falha em silêncio — erro comum
addopts = "-q"

[tool.pyright]
include = ["src"]
```

## Layout

```
├── pyproject.toml
├── uv.lock
├── src/meu_projeto/        # layout src/: o pacote só importa instalado —
│   ├── __init__.py         #   pega import quebrado que "funcionava" por acidente
│   └── ...
└── tests/
```

## Regras

1. **Nunca edite dependências à mão** no pyproject — `uv add`/`uv remove` mantêm lock e metadata coerentes.
2. **Config de ferramenta só aqui** — ruff, pyright e pytest no `pyproject.toml`; arquivos avulsos (`.flake8`, `mypy.ini`) não entram.
3. **Grupos de dependência** (PEP 735) para dev/test — não poluem o que o usuário instala.
4. **Entry point de CLI** via `[project.scripts]` (`meu-cli = "meu_projeto.cli:main"`), com o mesmo contrato de script: argparse, exit codes, docstring.
