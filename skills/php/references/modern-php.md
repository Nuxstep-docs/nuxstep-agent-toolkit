# PHP 8.x — o recurso certo no lugar do hábito antigo

| Hábito antigo | PHP moderno |
|---|---|
| Constantes de classe como "enum" | `enum Status: string { case Active = 'active'; ... }` (métodos no enum!) |
| Getters/setters boilerplate | Propriedades `readonly` + constructor promotion; **property hooks** (8.4+) quando precisar de lógica em get/set |
| `switch` com `break` | `match` (expressão, estrita, exaustiva) |
| `array('a' => 1)` como DTO | `final readonly class` com tipos |
| `call_user_func`/strings de callback | First-class callable syntax: `$fn = strlen(...);` |
| Aninhamento de chamadas ilegível | **Pipe operator** (8.5+): `$slug = $titulo \|> trim(...) \|> strtolower(...) \|> fn($s) => str_replace(' ', '-', $s);` |
| `isset($x) ? $x : $y` | `??` e `?->` (nullsafe) |
| `list()` | Destructuring `[$a, $b] = $par;` |

## Exemplo — DTO de borda moderno

```php
declare(strict_types=1);

enum PlanTier: string
{
    case Free = 'free';
    case Pro = 'pro';

    public function maxSeats(): int
    {
        return match ($this) {
            self::Free => 1,
            self::Pro => 25,
        };
    }
}

final readonly class CreateAccountInput
{
    public function __construct(
        public string $email,
        public PlanTier $tier,
    ) {
        filter_var($email, FILTER_VALIDATE_EMAIL) !== false
            || throw new InvalidArgumentException('E-mail inválido');
    }
}
```

Imutável, validado no construtor, tipo fechado pelo enum — o resto da aplicação confia no objeto, não re-valida array.
