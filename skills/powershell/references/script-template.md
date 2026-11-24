# Blueprints

## Script padrão-ouro (`.ps1`)

```powershell
#Requires -Version 7.4
<#
.SYNOPSIS
    Remove backups mais antigos que o período de retenção.
.DESCRIPTION
    Varre -Path, identifica .bak além de -RetentionDays e remove com
    suporte a -WhatIf/-Confirm. Pensado para rodar agendado ou em CI.
.EXAMPLE
    ./Remove-OldBackup.ps1 -Path /backups -RetentionDays 30 -WhatIf
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [ValidateScript({ Test-Path $_ -PathType Container })]
    [string]$Path,

    [ValidateRange(1, 365)]
    [int]$RetentionDays = 30
)

Set-StrictMode -Version 3.0
$ErrorActionPreference = 'Stop'

try {
    $limit = (Get-Date).AddDays(-$RetentionDays)
    $old = Get-ChildItem -Path $Path -Filter '*.bak' |
        Where-Object LastWriteTime -LT $limit

    foreach ($file in $old) {
        if ($PSCmdlet.ShouldProcess($file.FullName, 'Remover backup')) {
            Remove-Item -LiteralPath $file.FullName
        }
    }

    # saída é objeto: quem chamou decide o que fazer com ela
    [pscustomobject]@{
        Scanned = $Path
        Removed = $old.Count
        OlderThan = $limit
    }
}
catch {
    Write-Error "Falha ao limpar backups em '$Path': $_"
    exit 1
}
```

O que o blueprint demonstra: `#Requires`, comment-based help, validação declarativa nos parâmetros (`ValidateScript`/`ValidateRange` em vez de `if` manual), preâmbulo padrão, `ShouldProcess` no ponto destrutivo, `-LiteralPath` (imune a curinga em nome de arquivo), saída como objeto e exit code para CI.

## Função de módulo (`.psm1`)

Mesma anatomia, com `function Verb-Noun { ... }` exportada por `Export-ModuleMember` e manifesto `.psd1` (`New-ModuleManifest`) com `ModuleVersion` — consumidores fixam versão, não copiam arquivo.
