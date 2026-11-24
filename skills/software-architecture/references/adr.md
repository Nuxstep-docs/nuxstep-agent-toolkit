# ADR — Architecture Decision Record

## Quando escrever

Decisão **cara de reverter**: escolha de tecnologia (banco, mensageria, framework), fronteira de serviço, modelo de dados central, dependência estrutural de terceiro, exceção deliberada a um padrão do playbook. As escadas das skills `azure`/`aws`/`kubernetes` já exigem ADR para subir de degrau — o template canônico é este. CRUD escolhendo lib de datas não precisa de ADR.

## Regras

1. **Constraints antes das opções** — prazo, orçamento, time, tráfego esperado, stack aprovada (tool MCP `get_approved_stack`): são elas que decidem, não a tabela de features.
2. **No mínimo duas opções nomeadas** — mesmo com favorita clara; a alternativa explícita é o que torna a decisão auditável depois ("por que não X?" já está respondido).
3. **Requisitos não-funcionais pesam igual** — latência, custo mensal, familiaridade do time e carga de manutenção entram na tabela com o mesmo peso de features.
4. **Consequências honestas** — toda decisão piora algo; ADR sem "o que fica mais difícil" está incompleto.
5. **ADR é imutável** — mudou a decisão? Novo ADR com `Supersedes: ADR-NNN`; nunca edite o antigo (ele explica o código que ainda existe).
6. **Vive no repo do projeto** — `docs/adr/NNNN-titulo-curto.md`, numerado em sequência, linkado do PR que o implementa.

## Template

```markdown
# ADR-NNNN: [título — a decisão, não o tema]

**Status:** Proposto | Aceito | Deprecado | Superseded por ADR-NNN
**Data:** [data] · **Decisores:** [quem aprova]

## Contexto
[Situação e forças em jogo: requisito, constraint, dor atual. 1 parágrafo.]

## Constraints
- [prazo/custo/time/tráfego/stack aprovada]

## Opções consideradas

### Opção A: [nome]
| Dimensão | Avaliação |
|---|---|
| Complexidade | Baixa/Média/Alta + porquê |
| Custo (setup + mensal) | … |
| Escalabilidade | … |
| Familiaridade do time | … |
| Manutenção | … |

**Prós:** … · **Contras:** …

### Opção B: [nome]
[mesmo formato]

## Decisão
[Qual opção e o raciocínio decisivo em 2–3 frases]

## Consequências
- **Fica mais fácil:** …
- **Fica mais difícil:** …
- **Revisitar quando:** [gatilho concreto: tráfego X, time de N pessoas, custo Y]

## Ações
1. [ ] [passo de implementação/migração]
```
