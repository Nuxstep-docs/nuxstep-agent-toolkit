# Testes — Pester e PSScriptAnalyzer

## Pester (padrão da stack)

Estrutura `Describe → Context → It`; arquivo `<Nome>.Tests.ps1` ao lado do módulo.

```powershell
BeforeAll {
    . $PSScriptRoot/Get-AppBackup.ps1
}

Describe 'Get-AppBackup' {
    Context 'quando o diretório tem backups' {
        BeforeAll {
            Mock Get-ChildItem {
                [pscustomobject]@{ Name = 'db-2026-10-29.bak'; Length = 42mb }
            }
        }
        It 'retorna objetos com nome e tamanho' {
            $result = Get-AppBackup -Path '/backups'
            $result.Name | Should -Be 'db-2026-10-29.bak'
            Should -Invoke Get-ChildItem -Exactly 1
        }
    }
    Context 'quando o caminho não existe' {
        It 'lança erro terminating' {
            { Get-AppBackup -Path '/nada' } | Should -Throw
        }
    }
}
```

Regras:

- **Mock para todo efeito externo** (arquivo, rede, AD, Azure): o teste roda em qualquer máquina, inclusive no runner Linux do CI. `Should -Invoke` verifica que o efeito foi chamado como esperado.
- **Função destrutiva testa-se com `-WhatIf`** primeiro e com mock do efeito depois — nunca contra recurso real.
- **Lógica separada de efeito**: função pura que decide + função fina que executa; a pura se testa sem mock nenhum (skill `tdd` — as regras anti-fraude valem aqui: teste vermelho não se apaga).

## PSScriptAnalyzer

- Local: `Invoke-ScriptAnalyzer -Path . -Recurse -Severity Warning,Error` limpo antes do commit.
- Configuração versionada em `PSScriptAnalyzerSettings.psd1` na raiz (regras compartilhadas iguais para todos).
- Supressão é exceção justificada no código:
  `[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSUseApprovedVerbs', '', Justification = 'compatibilidade com API legada X')]`

## CI (runner Linux serve — pwsh é cross-platform)

```yaml
- shell: pwsh
  run: |
    Install-Module Pester, PSScriptAnalyzer -Force -Scope CurrentUser
    Invoke-ScriptAnalyzer -Path . -Recurse -Severity Warning,Error -EnableExit
    $r = Invoke-Pester -PassThru
    if ($r.FailedCount -gt 0) { exit 1 }
```

(Pin de versões dos módulos e permissions mínimas do workflow: skill `github-actions`.)
