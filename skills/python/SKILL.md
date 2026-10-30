---
name: python
description: >-
  Padrões da Nuxstep para Python: uv como gerenciador (com detecção de
  contexto), scripts standalone com PEP 723, ruff com contenção, type hints +
  pyright, fail loud e pytest. Use ao escrever ou revisar qualquer código
  Python — script, automação, CLI ou serviço — também em pedidos implícitos
  como "cria um script para isso", "automatiza em python", "esse script deu
  erro" ou "converte esse bash para python".
license: Proprietary
metadata:
  globs: "**/*.py,pyproject.toml,uv.lock"
  category: language
  visibility: "public"
---

# Python

Linguagem padrão para scripts, automação e tooling (versões vigentes de Python/uv/ruff: tool MCP `get_approved_stack` quando disponível; sem ela, confira o ciclo de suporte em devguide.python.org/versions). Piso: `requires-python = ">=3.11"` — 3.10 já saiu de suporte.

1. **uv como gerenciador único — com detecção de contexto** — `uv add/remove/sync/run`; nunca `pip install`, venv ativado à mão ou `requirements.txt` novo; `uv.lock` versionado. **Projeto existente manda**: lockfile de Poetry/PDM/pip presente → use a ferramenta do projeto, não imponha uv. `uvx` executa pacote arbitrário do PyPI — só nome conhecido e pinado.
2. **Script standalone = PEP 723** — dependências declaradas no próprio arquivo (bloco `# /// script`), executado com `uv run script.py`; nada de venv/requirements para um script. Sintaxe e blueprint: pack [scripts.md](references/scripts.md).
3. **Contrato de script** — `argparse` com `--help` honesto, exit code 0/≠0 (CI lê código de saída, não stack trace), docstring de uso no topo, 1 script = 1 tarefa.
4. **ruff para lint E format, com contenção** — `ruff check --fix` ANTES de `ruff format`; toque só nos arquivos que você está editando; projeto que não adota ruff não se reformata de carona (diff gigante de formatação é achado de review, não ajuda).
5. **Type hints + pyright** — anotações obrigatórias em toda fronteira pública (funções exportadas, retornos); checagem com pyright (o `ty` da Astral segue em observação enquanto beta). Supressão só com código de regra e motivo (`# pyright: ignore[rule] # motivo`), nunca bare ignore.
6. **Fail loud** — exceção nunca é engolida (`except: pass` proibido) e erro nunca vira fallback com dado inventado; re-lance com contexto (`raise XError(...) from err`). Herda a regra 7 da skill `clean-code`.
7. **Tudo no `pyproject.toml`** — config de ruff, pyright e pytest (`[tool.pytest.ini_options]` — a seção `[tool.pytest]` não existe e falha em silêncio) num lugar só; sem `setup.cfg`, `.flake8` ou `mypy.ini` novos. Pacote instalável usa layout `src/`: pack [project-setup.md](references/project-setup.md).
8. **Idioma moderno** — `pathlib` para caminhos (nunca concatenação de string), f-strings, `datetime` sempre com timezone explícita (naive datetime é bug latente), dataclasses para dados estruturados.

## Testes (TDD)

Ciclo red-green-refactor com **pytest**: teste que falha pelo motivo certo → mínimo que passa → refactor. Lógica pura testada direto; efeitos (rede, disco, subprocess) atrás de fronteiras mockáveis (skill `tdd` — regras anti-fraude valem: teste vermelho não se apaga). Backend/serviço maior: estrutura pela skill `software-architecture`. Detalhes: [testing.md](references/testing.md).

## Não faça

- ❌ `pip install` / ativar venv à mão → ✅ `uv add` / `uv run` (onde o projeto usa uv)
- ❌ `requirements.txt` novo → ✅ `pyproject.toml` + `uv.lock`; script usa PEP 723
- ❌ `except Exception: pass` ou fallback com dado fake → ✅ falhe alto, `raise ... from err`
- ❌ Reformatar o projeto inteiro de carona → ✅ ruff só nos arquivos tocados
- ❌ `mypy.ini`/`setup.cfg`/`.flake8` novos → ✅ tudo no `pyproject.toml`
- ❌ Adotar `ty` como checker padrão hoje → ✅ pyright (ty em observação até sair do beta)

## Quando ler o quê

- [scripts.md](references/scripts.md) — PEP 723 completo (sintaxe, shebang `uv run --script`, `exclude-newer` p/ reprodutibilidade) e blueprint padrão-ouro de script. Leia ao criar qualquer script standalone.
- [project-setup.md](references/project-setup.md) — projeto uv do zero: `pyproject.toml` padrão-ouro (ruff/pyright/pytest), layout `src/`, dependency-groups. Leia ao iniciar um pacote/serviço.
- [testing.md](references/testing.md) — pytest: fixtures, parametrize, tmp_path, mock nas fronteiras. Leia ao escrever testes.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
