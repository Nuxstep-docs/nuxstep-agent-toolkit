# Design de dashboards

## Princípios

- **Pergunta antes do painel**: cada dashboard conta uma história ou responde uma pergunta concreta. "Mostrar as métricas do serviço X" não é pergunta; "o serviço X está atendendo dentro do SLO?" é.
- **Carga cognitiva mínima**: o teste é tempo-até-entender. Mostre só o que responde à pergunta — para "quais servidores têm problema?", liste os com problema, não todos.
- **Geral → específico**: overview de alto nível no topo, drill-down por linha/link. Em RED de microsserviços, uma linha por serviço na ordem do fluxo de dados.
- **Compare o comparável**: magnitudes muito diferentes em dashboards separados — agregação com escala errada esconde o que importa. Normalize (percentual, razão) sempre que possível.
- **Cor é semântica**: thresholds com significado idêntico em todos os dashboards (verde ok, amarelo atenção, vermelho ação). Cor decorativa confunde.

## Métodos: o que colocar no dashboard

| Método | Sinais | Para quê | Mostra |
|---|---|---|---|
| **RED** | Rate, Errors, Duration | Serviços/microsserviços | Sintomas — a felicidade do usuário |
| **USE** | Utilization, Saturation, Errors | Infra (CPU, memória, rede, disco) | Causas — a felicidade das máquinas |
| **Four Golden Signals** | Latency, Traffic, Errors, Saturation | Serviços (RED + saturação) | Sintomas + quanto falta para o limite |

Regra de ouro: **alerta aponta para dashboard RED** (sintoma); USE é onde se investiga a causa depois que o alerta RED disparou. As regras de alerta em si vivem no Prometheus (skill `prometheus`, pack `alerting.md`).

## Modelo de maturidade (onde o projeto está?)

1. **Baixo (default caótico)**: todo mundo edita, cópias e órfãos por toda parte, JSON sem versionamento, alerta que não aponta para dashboard nenhum.
2. **Médio (metódico)** — piso deste playbook: variáveis de template, hierarquia com drill-down, eixos normalizados, navegação dirigida por links, JSON versionado.
3. **Alto (otimizado)**: combate ativo ao sprawl, revisão periódica com lista mestre, uso rastreado, dashboards gerados por código, edição no navegador desabilitada em produção, mudanças testadas em instância separada (ver `strict-mode.md`).

## Armadilhas

- **Sprawl**: a forma nº 1 de criá-lo é duplicar um dashboard, mudar uma coisa e manter as tags. Para visão customizada do mesmo dado, prefira link com parâmetros de URL ao dashboard mestre.
- **Stacking**: empilhar séries distorce leitura individual — desligue por default, ligue só quando a soma é o que importa.
- **Refresh agressivo**: refresh menor que a frequência do dado só sobrecarrega backend e rede.
- **Dashboard temporário eterno**: prefixo `TMP:`, e some com ele ao fim da investigação.

## Checklist de review

- [ ] Propósito em uma frase? Painéis respondem só a ele?
- [ ] Geral → específico, com drill-down/links?
- [ ] Variáveis em vez de cópias? Data source é variável?
- [ ] Cores/thresholds com semântica consistente? Eixos normalizados?
- [ ] Título claro, dono identificável, tags corretas, descrições no "i"?
- [ ] Refresh compatível com o dado?
- [ ] JSON versionado e provisionado?
- [ ] Anotações de deploy ativas?
- [ ] Alertas relevantes linkam para cá (se RED)?
