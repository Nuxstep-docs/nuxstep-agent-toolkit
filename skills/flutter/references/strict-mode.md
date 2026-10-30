# Modo Estrito — Flutter

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **`very_good_analysis` como lint** (ou conjunto equivalente mais duro que `flutter_lints`), zero warnings no CI.
2. **Golden tests** nos componentes visuais do design system — mudança visual é diff revisado.
3. **Testes de integração (`integration_test`/Patrol) nos fluxos críticos** rodando em device/emulador no CI.
4. **Cobertura 80% no domínio Dart puro** (herda `tdd` strict); domínio sem import de Flutter verificado por lint de camadas (`dart_code_metrics`/import-lint).
5. **Acessibilidade** — `Semantics` corretos nos interativos; navegação por TalkBack/VoiceOver testada nos fluxos principais.
6. **Observabilidade desde o primeiro release** — crash reporting (Sentry/Crashlytics) + monitoramento de jank (frames > 16ms) nas telas-chave.
