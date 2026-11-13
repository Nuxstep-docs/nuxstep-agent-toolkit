# Modo Estrito — PowerShell

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **Cobertura Pester mínima acordada** — alvo definido no projeto (ex.: 80% nas funções exportadas) medido com `Invoke-Pester -CodeCoverage`; função exportada sem teste bloqueia merge.
2. **PSScriptAnalyzer em Error como gate duro** — CI falha em qualquer Warning; supressões auditadas periodicamente.
3. **Tipagem explícita nas bordas** — parâmetros e retornos de funções exportadas tipados (`[string]`, `[pscustomobject]`, classes); `OutputType` declarado.
4. **Assinatura de script** — em ambiente Windows gerenciado, scripts assinados (certificado corporativo) e `ExecutionPolicy AllSigned` no destino.
5. **Módulos publicados em repositório interno** — PSResourceGet contra feed privado (Azure Artifacts/galeria interna) com versionamento SemVer; `Install-Module` de galeria pública em produção exige pin de versão + revisão.
6. **Transcrição em automação sensível** — `Start-Transcript` (ou logging estruturado) nas execuções agendadas, com retenção definida — trilha de auditoria de quem rodou o quê.
