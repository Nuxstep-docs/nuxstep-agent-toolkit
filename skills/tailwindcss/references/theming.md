# Tailwind v4 — Tema e tokens

## Estrutura recomendada

```css
@import "tailwindcss";

@theme {
  /* Paleta base (OKLCH: interpolação e contraste melhores) */
  --color-brand: oklch(0.6 0.15 250);
  --color-surface: oklch(0.98 0.005 250);
  --color-destructive: oklch(0.55 0.2 25);

  --font-sans: "Inter", ui-sans-serif, system-ui;
  --radius-card: 0.75rem;
}
```

Todo token do `@theme` vira utilitário (`bg-brand`, `rounded-card`) E custom property (`var(--color-brand)`) — um lugar só para o design inteiro.

## Tokens semânticos > escala crua

Camada semântica em cima da paleta: `--color-destructive` aponta para o vermelho do tema. O componente usa `text-destructive`; rebrand ou dark mode trocam o token, não os componentes.

## Dark mode

1. Defina os tokens nos dois temas (media query ou `@custom-variant dark` com classe/atributo).
2. Componentes usam tokens semânticos — `dark:` explícito fica para exceções pontuais de layout, não para repintar cor a cor.

```css
@custom-variant dark (&:where([data-theme="dark"] *));
:root[data-theme="dark"] {
  --color-surface: oklch(0.18 0.01 250);
}
```

## Migração v3 → v4

`npx @tailwindcss/upgrade` resolve o grosso (config JS → CSS, renames de escala). Depois: mova valores do antigo `theme.extend` para `@theme`, troque `safelist` (não existe mais) por classes completas no fonte/`@source`, e rode a suíte visual. Confirme a versão vigente com `get_approved_stack`.
