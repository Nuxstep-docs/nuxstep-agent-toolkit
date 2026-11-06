# Nuxstep Agent Toolkit

Skills, subagents, comandos e hooks de engenharia da Nuxstep no formato aberto [Agent Skills](https://agentskills.io) — com manifestos de plugin para Claude Code e Cursor, instalador para VS Code/Copilot, Antigravity, Codex e compatíveis, e conector MCP para chats (claude.ai web e desktop).

> Repositório **gerado automaticamente** a partir do hub privado de engenharia da Nuxstep. Não abra PRs aqui — o conteúdo é sobrescrito a cada sincronização.
>
> © Nuxstep — conteúdo distribuído para uso com as ferramentas acima; licença formal a definir (trate como todos os direitos reservados).

## Claude Code (plugin — recomendado)

```bash
claude plugin marketplace add Nuxstep-docs/nuxstep-agent-toolkit
claude plugin install nuxstep-agent-toolkit@nuxstep-agent-toolkit
```

Entrega skills com disparo automático, subagents, o comando `/nuxstep-agent-toolkit:build-feature`, hooks de garantia e o MCP remoto da Nuxstep (login OAuth; acesso concedido por convite).

## Cursor (plugin)

Dashboard → Plugins & MCPs → **Add Marketplace** → *Import from Repo* → URL deste repositório. Alternativa local: clone em `~/.cursor/plugins/local/nuxstep-agent-toolkit` e recarregue o Cursor.

## Demais harnesses (instalador)

```bash
npx @nuxstep/agent-toolkit@latest                      # checklist interativo
npx @nuxstep/agent-toolkit@latest --tools cursor,vscode,antigravity,codex
npx @nuxstep/agent-toolkit@latest --hooks              # inclui o guard de shell no Cursor
npx @nuxstep/agent-toolkit@latest --list | --remove all | --dry-run
```

O instalador copia as skills para o diretório nativo de cada harness (`~/.cursor/skills`, `~/.copilot/skills`, `~/.gemini/config/skills`, `~/.agents/skills`), instala subagents/comandos transpilados onde a ferramenta suporta e registra o MCP remoto. Tudo rastreado em `~/.nuxstep/toolkit.json` — `--remove` desfaz só o que ele instalou. Sem npm: `git clone` deste repo + `node install.mjs`.

## Chats — claude.ai web e desktop (conector MCP)

Sem instalar nada: adicione um conector custom em **Settings → Connectors → Add custom connector** com a URL:

```text
https://mcp-ai.nuxstep.com/mcp
```

A configuração vale para o claude.ai no navegador e para o app desktop do Claude (é por conta, não por dispositivo). O login é OAuth (conta Google) e o acesso é concedido por convite da Nuxstep. Conectado, o chat consulta os padrões automaticamente nas tarefas de engenharia, e os prompts guiados do fluxo Spec-Driven (`spec-specify`, `spec-plan`, `spec-tasks`, `spec-implement`, `architecture-consultant`, `audit-code`) aparecem no menu **+** da conversa. Outros clients MCP (ex.: ChatGPT em developer mode) usam a mesma URL. A primeira chamada após inatividade pode levar ~10–30 s (scale-to-zero).

## O que cada ferramenta recebe

| Capability | Claude Code (plugin) | Cursor (plugin ou npx) | VS Code/Copilot (npx) | Antigravity (npx) | Codex (npx) |
|---|---|---|---|---|---|
| Skills (39, auto-disparo) | ✅ | ✅ `~/.cursor/skills` | ✅ `~/.copilot/skills` | ✅ `~/.gemini/config/skills` | ✅ `~/.agents/skills` |
| Subagents (3) | ✅ completos | ✅ transpilados (`architect-advisor` e `code-reviewer` readonly) | ✅ transpilados (`.agent.md`) | ❌ sem equivalente | ❌ |
| Comando `/build-feature` | ✅ | ✅ (spec-kit em `~/.nuxstep/toolkit/`) | ❌ (prompt files são por workspace) | ➖ (a CLI converte skills em comandos sozinha) | ❌ |
| Hooks (guard de shell) | ✅ automáticos + Conventional Commits | ✅ opt-in (`--hooks`, só o guard de shell) | ❌ | ❌ | ❌ |
| MCP remoto | ✅ embutido no plugin | ✅ registrado | ✅ registrado | ✅ registrado | ❌ |

As diferenças vêm do que cada harness suporta — o conteúdo nasce todo da mesma árvore. Onde o MCP está registrado, o conhecimento dinâmico (stack aprovada, playbooks, bootstrap, prompts `spec-*`) chega igual em todas as ferramentas; os chats (seção acima) são o caso extremo: zero arquivos, 100% MCP.

## Skills publicadas

- `ansible`
- `argocd`
- `aws`
- `azure`
- `clean-code`
- `digitalocean`
- `flutter`
- `github-actions`
- `grafana`
- `hashicorp-vault`
- `html-css`
- `incident-response`
- `java-spring-boot`
- `kafka`
- `kubernetes`
- `linux-shell`
- `material-design`
- `mysql`
- `nestjs`
- `nextjs`
- `oci`
- `php`
- `playwright`
- `postgresql`
- `powershell`
- `prometheus`
- `python`
- `rabbitmq`
- `react`
- `react-native`
- `redis`
- `software-architecture`
- `supabase`
- `tailwindcss`
- `tdd`
- `terraform`
- `typescript`
- `ui-design`
- `vercel`

## Agents publicados

Subagents para Claude Code (chegam junto com o plugin acima):

- `architect-advisor`
- `code-reviewer`
- `implementer`

## Comandos publicados

- `/nuxstep-agent-toolkit:build-feature`

## Hooks de garantia

O plugin inclui hooks que bloqueiam comandos destrutivos (`rm -rf` perigoso, force-push, `terraform -auto-approve`) e exigem Conventional Commits — proteção executável, ativa em toda sessão com o plugin instalado.

## Fluxo Spec-Driven

O plugin traz os templates e workflows SDD (`spec-kit/`) usados pelo comando `build-feature`: constitution → spec → plan → tasks → implement, com revisão automatizada por subagent.

