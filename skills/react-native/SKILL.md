---
name: react-native
description: >-
  Padrões da Nuxstep para apps mobile com React Native + Expo (o toolchain
  padrão): expo-router, listas virtualizadas, segredos fora do bundle,
  animações na UI thread e EAS para build/updates. Use sempre que criar ou
  alterar telas, navegação, listas ou integrações nativas em apps RN/Expo —
  também em pedidos implícitos como "crie a tela no app", "a lista está
  travando", "publica uma atualização do app".
license: Proprietary
metadata:
  globs: "**/*.tsx,**/*.ts,app.json,app.config.*,eas.json"
  category: mobile
  visibility: "public"
---

# React Native (+ Expo)

**Expo é o toolchain padrão da Nuxstep** — projeto novo nasce com `create-expo-app`; RN "bare" só com justificativa em ADR. Componentes/hooks seguem a skill `react`; tipos, a skill `typescript`. Versões vigentes (SDK/RN): tool MCP `get_approved_stack`.

1. **Managed first** — fique no fluxo gerenciado; precisa de nativo? `prebuild` + config plugins e dev client — não "ejetar".
2. **Navegação com expo-router** — file-based em `app/`; telas são rotas, layouts aninhados, deep link de graça.
3. **Tudo no bundle é público** — chave de API/segredo NUNCA no app: chamadas sensíveis passam pelo seu backend; env do Expo só para valores publicáveis.
4. **Lista é virtualizada** — FlashList (ou FlatList) com `keyExtractor` estável; `ScrollView` + `.map()` só para punhado fixo de itens.
5. **Animação fora da JS thread** — Reanimated/gestos nativos; animar via `setState` trava o app no primeiro aparelho modesto.
6. **Estado**: servidor = TanStack Query; UI global = Zustand (mesmo padrão da web); não copie resposta de API para store.
7. **Permissões no contexto de uso** — peça câmera quando o usuário tocar em "tirar foto", explique antes, e trate a negação com caminho alternativo.
8. **Específico de plataforma isolado** — arquivos `.ios.tsx`/`.android.tsx` ou abstração própria; `Platform.OS` espalhado em if é smell.
9. **EAS para build e OTA** — `eas build`/`eas submit`; EAS Update para JS/assets (OTA não atualiza código nativo — mudou nativo, é build nas lojas).
10. **New Architecture é o padrão** — SDK atual nem tem a legada; bibliotecas escolhidas precisam suportá-la (cheque antes de adicionar).

## Testes (TDD)

Jest + preset `jest-expo` + React Native Testing Library (query por papel/texto acessível, como na web). e2e crítico com Maestro. Método: skill `tdd`.

## Não faça

- ❌ API key no código do app ("ninguém vai ver") → ✅ backend/proxy — o bundle é extraível
- ❌ `ScrollView` com `.map()` para lista que cresce → ✅ FlashList virtualizada
- ❌ Ejetar para bare "para ter controle" → ✅ prebuild + config plugin resolve quase tudo
- ❌ OTA update com mudança nativa junto → ✅ mudou nativo = novo build nas lojas
- ❌ Lib sem suporte à New Architecture → ✅ verifique compatibilidade antes de instalar

## Quando ler o quê

- [expo-workflow.md](references/expo-workflow.md) — EAS build/submit/update, canais e versionamento, dev client, config plugins. Leia ao configurar CI/CD do app ou publicar.
- Estrutura de pastas (feature-first; `app/` do Expo Router só com rotas, `screens/` dentro da feature): pack [project-structure.md](../react/references/project-structure.md) da skill `react`.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
