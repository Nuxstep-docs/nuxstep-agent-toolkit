---
name: flutter
description: >-
  Padrões da Nuxstep para apps Flutter/Dart: widgets pequenos e const, Riverpod
  para estado, camadas com domínio em Dart puro, go_router, tema Material 3
  central e testes de widget. Use sempre que criar ou alterar telas, widgets,
  providers ou navegação em projetos Flutter — também em pedidos implícitos
  como "crie essa tela no app", "o app está travando ao rolar", "adicione um
  formulário".
license: Proprietary
metadata:
  globs: "**/*.dart,pubspec.yaml,analysis_options.yaml"
  category: mobile
  visibility: "public"
---

# Flutter

Padrões para Flutter/Dart (versões vigentes: tool MCP `get_approved_stack`). Arquitetura segue a skill `software-architecture` na dose certa.

1. **Lints desde o dia 1** — `flutter_lints` no `analysis_options.yaml`; análise limpa antes do commit.
2. **Widget pequeno, classe, `const`** — extraia subárvores como **classes de widget** (não métodos `_buildX()`): classe permite `const` e rebuild granular; `build()` com rolagem é smell.
3. **Estado com Riverpod** — padrão do playbook para DI + estado (compile-safe, testável sem `BuildContext`); `setState` ok para estado local trivial; Bloc aceito em legado/time que já o usa.
4. **Camadas** — widget → provider/controller → repository (port) → data source; regra de negócio em **Dart puro** (sem Flutter import), testável sem emulador.
5. **Async explícito** — todo `AsyncValue`/`snapshot` renderiza os três estados (loading/erro/dado); engolir o erro do `FutureBuilder` é bug silencioso.
6. **Navegação com go_router** — rotas declarativas, deep link e guards num lugar só.
7. **Tema central (Material 3)** — tokens no `ThemeData`/`ColorScheme.fromSeed`; cor/fonte hardcoded em widget é reprovável.
8. **Lista com `.builder`** — `ListView.builder`/`SliverList` para qualquer lista que cresce; keys estáveis em itens reordenáveis.
9. **Segredo fora do app** — o binário é extraível (igual React Native): chamadas sensíveis via backend; `--dart-define` só para config publicável.

## Testes (TDD)

`flutter_test`: unidade para domínio Dart puro (rápido, sem device), widget tests com `tester.pumpWidget` + finders por semântica, `mocktail` para dublês de ports. Método: skill `tdd`.

## Não faça

- ❌ `build()` de 200 linhas → ✅ widgets-classe extraídos e `const`
- ❌ Método `_buildHeader()` retornando árvore → ✅ classe `Header` (habilita const/rebuild fino)
- ❌ Regra de negócio dentro do widget/provider de UI → ✅ use case/repository em Dart puro
- ❌ `ListView(children: itens.map(...))` para lista longa → ✅ `.builder`
- ❌ `ref.watch` do provider inteiro quando só um campo muda → ✅ `select` para rebuild fino

## Quando ler o quê

- [state-riverpod.md](references/state-riverpod.md) — padrões Riverpod: tipos de provider, AsyncNotifier, select, invalidação, teste de provider. Leia ao modelar estado ou revisar rebuilds.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
