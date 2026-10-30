# Material 3 — Tema por seed

## Flutter

```dart
final theme = ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4F46E5)),
  useMaterial3: true,
);
final darkTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF4F46E5),
    brightness: Brightness.dark,
  ),
);
// Widget: Theme.of(context).colorScheme.primary — nunca Color(0xFF...)
```

Dark mode vem do mesmo seed com `brightness` — os pares `on-*` continuam válidos nos dois temas.

## MUI (web)

```tsx
const theme = createTheme({
  palette: { primary: { main: '#4F46E5' } },
  colorSchemes: { dark: true }, // gera o esquema escuro
});
// Componente: sx={{ color: 'primary.main', bgcolor: 'background.paper' }} — tokens, não hex
```

## Camadas de token (onde customizar)

| Camada | O que é | Customize quando |
|---|---|---|
| Reference | Paleta gerada do seed (tons) | Quase nunca — troque o seed |
| System | Roles (`primary`, `surface`, `error`...) | Ajuste pontual de marca (ex.: error próprio) |
| Component | Tokens de um componente (altura do botão) | Último recurso, via API de tema do framework |

Regra prática: quanto mais baixa a camada que você tocou, mais coisas quebram no próximo upgrade — comece sempre pelo seed.
