# Modo Estrito — React Native

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **e2e Maestro nos fluxos críticos** (login, ação principal, compra) rodando no CI em build de preview.
2. **Orçamento de performance** — tempo de startup e de navegação entre telas-chave medidos (ex.: Sentry/Firebase Perf); regressão bloqueia release.
3. **Acessibilidade mobile** — `accessibilityLabel`/`role` nos elementos interativos; navegação por leitor de tela testada nos fluxos principais.
4. **Crash reporting + source maps** obrigatórios desde o primeiro release (Sentry), com upload de sourcemaps no build do EAS.
5. **Canal de rollback** — todo `eas update` de produção tem plano de reversão (republicar update anterior); release de loja em rollout gradual.
6. **Auditoria de libs nativas** — dependência com código nativo entra só com checagem de manutenção/New Architecture registrada no PR.
