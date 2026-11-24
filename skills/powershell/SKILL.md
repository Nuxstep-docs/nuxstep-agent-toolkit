---
name: powershell
description: >-
  Padrões da Nuxstep para PowerShell: pwsh 7+ (LTS), preâmbulo com StrictMode e
  ErrorActionPreference Stop, Verb-Noun aprovado, objetos no pipeline,
  ShouldProcess em operação destrutiva, segredos via cofre, PSScriptAnalyzer e
  Pester. Use ao escrever ou revisar scripts/módulos .ps1/.psm1, automação
  Windows/Azure ou tarefas de administração — também em pedidos implícitos como
  "automatiza isso no Windows", "cria um script de provisionamento" ou "esse
  script quebrou".
license: Proprietary
metadata:
  globs: "**/*.ps1,**/*.psm1,**/*.psd1"
  category: language
  visibility: "public"
---

# PowerShell

Shell e linguagem de automação para Windows/Azure e cross-platform. Padrão do playbook: **pwsh 7 LTS** (roda em Windows/Linux/macOS); Windows PowerShell 5.1 só quando um módulo legado obriga — e isso fica registrado no projeto. Para bash/Linux, a skill é `linux-shell`.

1. **Preâmbulo obrigatório** — todo script começa com `Set-StrictMode -Version 3.0` (versão **pinada**; `Latest` muda de significado a cada release) e `$ErrorActionPreference = 'Stop'`: variável de digitada errada e erro silencioso morrem aqui.
2. **Verb-Noun aprovado** — função usa verbo da lista oficial (`Get-Verb`), substantivo singular em PascalCase (`Get-AppBackup`, nunca `Backups-Get`). Em script versionado, parâmetro é sempre nomeado e por extenso — posicional e alias (`gci`, `%`) são para a linha de comando interativa.
3. **Objetos, não texto** — função emite objetos no pipeline (`[pscustomobject]`); quem consome decide formato. `Write-Host` é só para mensagem a humano; `Format-*` é o ÚLTIMO elo, nunca no meio do pipeline (mata o objeto).
4. **Destrutivo = ShouldProcess** — função que altera estado usa `[CmdletBinding(SupportsShouldProcess)]` e `$PSCmdlet.ShouldProcess($alvo, $ação)`: ganha `-WhatIf`/`-Confirm` de graça, e todo teste manual começa com `-WhatIf`.
5. **Erro é terminating e vira exit code** — cmdlet crítico com `-ErrorAction Stop` dentro de `try/catch`; script de CI termina com `exit 1` em falha (runner não lê exceção, lê código de saída).
6. **Segredo nunca no script** — credencial vem de SecretManagement/cofre (skill `hashicorp-vault`) ou identidade gerenciada; `ConvertTo-SecureString -AsPlainText -Force` com literal é achado de review.
7. **PSScriptAnalyzer como gate** — `Invoke-ScriptAnalyzer` limpo antes do commit e no CI; regra suprimida exige justificativa inline.
8. **Script que cresceu vira módulo** — reuso é módulo (`.psm1` + manifesto `.psd1` com versão), nunca copiar `.ps1` entre repositórios. Comment-based help nas funções exportadas.
9. **Cross-platform por default** — `Join-Path` em vez de `\` hardcoded, sem `C:\` fixo, atenção a case-sensitivity de arquivos no Linux.

## Testes (TDD)

Ciclo red-green-refactor com **Pester** (ferramenta padrão): escreva o teste que falha, implemente o mínimo, refatore. Lógica de negócio em funções puras testáveis; efeitos externos (arquivo, rede, AD) isolados e mockados com `Mock`. Detalhes e exemplos: [testing.md](references/testing.md).

## Não faça

- ❌ `Set-StrictMode -Version Latest` → ✅ versão pinada (3.0)
- ❌ `Write-Host` para devolver dados → ✅ emitir objetos; Host só para humano
- ❌ `Remove-*`/`Set-*` sem ShouldProcess → ✅ `SupportsShouldProcess` + testar com `-WhatIf`
- ❌ Senha literal ou `-AsPlainText` no script → ✅ SecretManagement/cofre/identidade gerenciada
- ❌ Alias e posicional em script versionado (`gci $p`) → ✅ `Get-ChildItem -Path $p`
- ❌ Engolir erro com `Continue` default → ✅ `Stop` + `try/catch` + exit code

## Quando ler o quê

- [testing.md](references/testing.md) — Pester (estrutura, mocks, ShouldProcess em teste) e PSScriptAnalyzer no CI.
- [script-template.md](references/script-template.md) — blueprint padrão-ouro de script e de função avançada.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
