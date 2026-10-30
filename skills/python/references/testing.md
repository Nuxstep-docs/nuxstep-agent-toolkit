# Testes — pytest

Red-green-refactor (skill `tdd`); pytest é o runner padrão da stack.

## Padrões

```python
import pytest
from meu_projeto.pricing import apply_discount


def test_discount_applies_percentage() -> None:
    assert apply_discount(100.0, percent=10) == 90.0


def test_discount_rejects_negative_percent() -> None:
    with pytest.raises(ValueError, match="percent"):
        apply_discount(100.0, percent=-1)


@pytest.mark.parametrize(
    ("amount", "percent", "expected"),
    [(100.0, 0, 100.0), (100.0, 100, 0.0), (99.99, 50, 49.995)],
)
def test_discount_edges(amount: float, percent: int, expected: float) -> None:
    assert apply_discount(amount, percent=percent) == pytest.approx(expected)
```

- **Lógica pura testa direto, sem mock** (estilo Chicago — skill `tdd`). Se precisa de mock para testar uma regra, a regra está acoplada demais: separe decisão de efeito.
- **Efeito externo atrás de fronteira sua**: rede/disco/subprocess isolados numa função ou protocolo; no teste, `monkeypatch`/fake no SEU limite — nunca mock da lib de terceiro espalhado.
- **Arquivos com `tmp_path`** (fixture nativa): cada teste ganha diretório limpo; jamais escreva no repo ou em `/tmp` fixo.
- **Fixtures para arranjo repetido**; `conftest.py` só para o que vários arquivos usam — fixture global que ninguém entende é dívida.
- **`pytest.raises` sempre com `match`** — garantir que falhou pelo motivo certo é parte do RED.
- Teste de CLI: chame `main()` com args injetados e asserte o exit code e a saída — não subprocesse o próprio script sem necessidade.

## Execução

`uv run pytest` local e no CI (com `--locked` no sync). Saída real do runner é o único "passou" aceito — regra anti-fraude da skill `tdd`.
