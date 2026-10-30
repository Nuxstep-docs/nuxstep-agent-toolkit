# CSS moderno — quando usar o quê

Tudo abaixo é Baseline (amplamente suportado) — sem build step.

## Container queries — componente responsivo de verdade

Use quando o componente precisa se adaptar ao ESPAÇO dele (card no sidebar vs. no grid), não à viewport:

```css
.card-wrapper { container-type: inline-size; }
@container (min-width: 400px) {
  .card { grid-template-columns: 120px 1fr; }
}
```

Media query fica para decisões de PÁGINA (layout geral, navegação). Atenção: não funciona em elemento cuja largura vem do conteúdo.

## Cascade layers — especificidade sob controle

Declare a ordem uma vez; camada posterior vence independentemente de especificidade:

```css
@layer reset, base, components, utilities;
```

Utilitário em `utilities` vence componente sem `!important`. Migração: embrulhe o CSS legado numa layer baixa e escreva o novo por cima.

## `:has()` — o seletor de pai

`form:has(:invalid) .submit { opacity: .5 }`, `.card:has(img)` — elimina classes de estado duplicadas no JS. Custo de performance em seletores muito amplos (`body:has(...)` com subárvore gigante): escopo estreito.

## Nesting nativo

Bom para estados e variantes do próprio componente (`&:hover`, `&.is-open`, `@media` inline). Teto de ~3 níveis — nesting profundo acopla o CSS à árvore DOM e infla especificidade.

## Outros que valem conhecer

- `clamp()` para tipografia fluida: `font-size: clamp(1rem, 0.9rem + 1vw, 1.25rem)`.
- `aspect-ratio` em vez de hack de padding.
- `color-mix()` para variações de token: `color-mix(in oklch, var(--primary), black 15%)`.
- Subgrid quando filhos precisam alinhar com o grid do avô (tabelas de cards).
- View Transitions para navegação suave — progressive enhancement, nunca dependência.
