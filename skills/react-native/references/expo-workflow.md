# Expo — fluxo de build e publicação (EAS)

## Os três comandos

| Comando | Faz | Quando |
|---|---|---|
| `eas build` | Binário nas nuvens (dev client, preview APK/IPA, produção) | Mudou código nativo/config, ou release de loja |
| `eas submit` | Envia o binário para App Store/Play | Release |
| `eas update` | OTA de JS/assets para builds existentes | Correções e features SEM mudança nativa |

## Padrões

1. **Perfis no `eas.json`** — `development` (dev client), `preview` (QA interno), `production`; cada um com canal de update próprio (`channel: production` etc.).
2. **Versionamento remoto** — `appVersionSource: "remote"`: o EAS incrementa buildNumber/versionCode; ninguém edita na mão.
3. **Regra de ouro do OTA** — `eas update` só entrega JS/assets. Instalou lib com código nativo, mudou config plugin ou SDK? É `eas build` + lojas. OTA em cima de nativo divergente = crash em produção.
4. **Dev client em vez de Expo Go** quando o projeto tem módulo nativo — Expo Go só cobre o SDK puro.
5. **Secrets do EAS** (`eas env`) para tokens de build; lembrando: o que o APP consome em runtime continua público — segredo de verdade fica no backend.
6. **Fingerprint de compatibilidade** — confie no erro do EAS Update quando o runtime difere; não force update para runtime incompatível.

## Upgrade de SDK

Um upgrade por vez (`npx expo install expo@^<versão> --fix`), rode `npx expo-doctor`, teste no dev client novo antes de atualizar as lojas. Verifique a versão-alvo com `get_approved_stack`.
