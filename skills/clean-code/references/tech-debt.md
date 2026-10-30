# Dívida técnica — inventário e priorização

Para auditorias de codebase (assessment de consultoria) e para decidir **qual refactor fazer primeiro** quando a lista é maior que o tempo.

## Taxonomia

| Tipo | Exemplos | Risco se ignorar |
|---|---|---|
| **Código** | Duplicação, abstração errada, números mágicos | Bugs, desenvolvimento cada vez mais lento |
| **Arquitetura** | Monólito que pedia divisão (ou micro-serviços que pediam fusão), armazenamento errado para o acesso | Limite de escala, reescrita forçada |
| **Teste** | Cobertura rala no caminho crítico, testes flaky, zero integração | Regressão chega em produção |
| **Dependência** | Libs desatualizadas/abandonadas, major adiado há anos | CVEs, migração em pânico |
| **Documentação** | Runbook inexistente, README mentiroso, conhecimento só na cabeça de alguém | Onboarding caro, bus factor 1 |
| **Infra** | Deploy manual, sem monitoramento, sem IaC | Incidentes longos, recuperação lenta |

## Priorização

Pontue cada item de 1 a 5:

- **Impacto** — quanto atrasa o time hoje?
- **Risco** — o que acontece se nada for feito?
- **Esforço** — quão caro é resolver? (invertido: barato primeiro)

**Prioridade = (Impacto + Risco) × (6 − Esforço)**

A fórmula é régua de conversa, não oráculo: vitórias baratas de alto impacto sobem; reescritas caras de risco baixo descem — e um item de risco 5 (segurança, perda de dados) fura a fila independente do score.

## Regras de pagamento

1. **Justificativa de negócio por item** — "está feio" não prioriza; "toda feature nesse módulo custa 2× por causa disso" prioriza. Em cliente, traduza para custo/risco DELE.
2. **Parcelas junto de feature, não "sprint de refactor"** — plano faseado onde cada fase acompanha trabalho de produto que toca aquela área (regra do escoteiro em escala); a grande pausa para refatorar raramente sobrevive ao contato com o roadmap.
3. **Dívida declarada no momento em que nasce** — atalho consciente ganha registro (issue com o tipo acima) na hora; dívida invisível é a que afunda o projeto.
4. **Reavalie o inventário por trimestre** — item que nunca sobe de prioridade talvez não seja dívida, seja só código que você não gosta.
