# Templates de incidente

## Severidade

| Nível | Critério | Resposta | Cadência de comunicação |
|---|---|---|---|
| **SEV1** | Serviço fora do ar ou perda de dados; todos os usuários afetados | Imediata, prioridade sobre tudo | ~30 min |
| **SEV2** | Funcionalidade principal degradada; muitos usuários afetados | Até 15 min | ~1 h |
| **SEV3** | Funcionalidade secundária com problema; poucos afetados; há contorno | Até 1 h | No início e na resolução |
| **SEV4** | Cosmético ou impacto desprezível | Próximo dia útil | Registro em issue basta |

Impacto financeiro ou de reputação grave sem usuário percebendo (ex.: cobrança errada silenciosa) também é SEV1/2 — o critério é dano, não barulho.

## Status update (durante o incidente)

```markdown
## Incidente: [título curto]
**Severidade:** SEV[1–4] · **Status:** Investigando | Identificado | Monitorando | Resolvido
**Impacto:** [quem/o que está afetado, desde quando]
**Atualizado em:** [hora, fuso]

### Situação atual
[O que sabemos AGORA — fatos, não hipóteses]

### Ações tomadas
- [hora] [ação]

### Próximos passos
- [o que vem a seguir] — próximo update às [hora]
```

Para o cliente (consultoria): mesma estrutura, sem jargão interno — impacto no negócio dele, o que está sendo feito, quando falamos de novo. Nunca prometa causa ou prazo não confirmados.

## Timeline (mantida ao vivo)

| Hora (UTC) | Evento/ação |
|---|---|
| 14:02 | Alerta HighErrorRatio disparou (api-pedidos) |
| 14:05 | Rollback iniciado para v1.4.2 |

## Postmortem (obrigatório SEV1/2)

```markdown
# Postmortem: [título]
**Data:** [data] · **Duração:** [Xh] · **Severidade:** SEV[X]
**Autores:** [nomes] · **Status:** Rascunho | Revisado

## Resumo
[2–3 frases em linguagem simples: o que quebrou, por quanto tempo, impacto]

## Impacto
- Usuários/clientes afetados · duração · impacto de negócio (quantifique se possível)

## Timeline
[tabela acima, consolidada]

## Causa-raiz
[Explicação completa — sistema/processo, nunca pessoa]

## 5 porquês
1. Por que [sintoma]? → …
2. Por que [causa 1]? → …
   (siga até a causa SISTÊMICA — parar no erro humano é parar cedo demais)

## O que funcionou / O que falhou
- [detecção, mitigação, comunicação — dos dois lados]

## Action items
| Ação | Dono | Prioridade | Prazo |
|---|---|---|---|
| [preventiva/detectiva/corretiva] | [nome] | P0/P1/P2 | [data] |

## Lições
[o que o time leva — candidatas a virar regra/runbook/alerta no hub]
```

Regras do postmortem: escreva começando na timeline (ela já existe se a regra 4 foi seguida); revise os action items na retro seguinte — item vencido reabre a conversa, não some.
