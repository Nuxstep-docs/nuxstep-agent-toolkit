# Scripts standalone (PEP 723 + uv)

Um script com dependências declaradas **no próprio arquivo** — sem venv, sem requirements.txt, sem instalação prévia: `uv run script.py` resolve tudo.

## A sintaxe (spec PyPA "inline script metadata", ex-PEP 723)

Bloco de comentários começando com `# /// script` e terminando com `# ///`:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "httpx",
#   "rich",
# ]
# [tool.uv]
# exclude-newer = "2026-10-30T00:00:00Z"
# ///
```

- `dependencies` usa a sintaxe de requisito padrão (PEP 508): `"httpx>=0.28"`.
- **`exclude-newer`** congela a resolução no tempo: o script roda igual daqui a um ano (reprodutibilidade sem lockfile). Atualize a data deliberadamente quando quiser versões novas.
- Adicione dependência com `uv add --script meu_script.py httpx` — o uv edita o bloco por você.

## Blueprint padrão-ouro

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["httpx"]
# [tool.uv]
# exclude-newer = "2026-10-30T00:00:00Z"
# ///
"""Verifica a saúde dos serviços listados e sai com erro se algum falhar.

Uso:
    uv run check_health.py --targets https://api.example.com/health
    uv run check_health.py --targets a.example.com,b.example.com --timeout 5
"""

import argparse
import logging
import sys

import httpx

log = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--targets", required=True, help="URLs separadas por vírgula")
    parser.add_argument("--timeout", type=float, default=10.0)
    return parser.parse_args()


def check(url: str, timeout: float) -> bool:
    try:
        response = httpx.get(url, timeout=timeout)
        response.raise_for_status()
    except httpx.HTTPError as err:
        log.error("%s indisponível: %s", url, err)  # fail loud, com contexto
        return False
    return True


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    args = parse_args()
    results = [check(u.strip(), args.timeout) for u in args.targets.split(",")]
    return 0 if all(results) else 1


if __name__ == "__main__":
    sys.exit(main())
```

O que o blueprint demonstra: shebang `env -S uv run --script` (executável direto com `./check_health.py`), metadata inline com `exclude-newer`, docstring de uso que vira `--help` (`description=__doc__`), argumentos nomeados e validados, logging em vez de `print` para diagnóstico, erro tratado sem ser engolido, e `main() -> int` com `sys.exit` — o exit code é o contrato com o CI.

## Quando o script deixa de ser script

Passou de ~200 linhas, ganhou segundo arquivo ou precisa de testes próprios? Vire projeto uv (`uv init`, layout em [project-setup.md](project-setup.md)) — PEP 723 é para o arquivo único que faz uma tarefa.
