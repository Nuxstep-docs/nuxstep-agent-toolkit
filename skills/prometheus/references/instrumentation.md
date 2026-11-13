# Instrumentação por tipo de serviço

## Online-serving (API, banco, qualquer coisa com alguém esperando)

- Métricas-chave: requisições (`_total`), erros (`_total`) e latência (histogram `_seconds`); "em andamento" (gauge) é útil.
- Conte a requisição **ao terminar**, não ao iniciar — alinha contagem, erro e latência na mesma janela.
- Instrumente cliente **e** servidor quando ambos são seus: a divergência entre os dois lados é pista de depuração (rede, fila, timeout).

## Offline processing (pipeline, consumer, ninguém esperando)

- Por estágio: itens que entraram, em progresso, itens que saíram e timestamp do último item processado.
- A métrica que importa para o usuário é o **tempo de travessia** (lag ponta a ponta). Técnica do *heartbeat*: um item sintético com timestamp atravessa o pipeline; `time() - heartbeat_timestamp` mede a propagação real.
- Com batching: conte lotes de entrada e de saída, além dos itens.

## Batch jobs (roda e morre — scrape não alcança)

- Via **Pushgateway**: `<job>_last_success_timestamp_seconds` (gauge com timestamp Unix), duração total e por etapa, timestamp da última conclusão (sucesso ou falha).
- Job que roda mais frequente que ~15 min: vire daemon de offline processing e seja raspado normalmente.
- Job longo (minutos+): além do push, exponha `/metrics` para acompanhar recursos durante a execução.

## Subsistemas recorrentes

| Subsistema | Minimo a expor |
|---|---|
| Biblioteca/cliente de recurso externo | consultas `_total`, erros `_total`, latência; label para distinguir o recurso (ex.: nome do banco no pool) |
| Falhas | counter de falhas **e** counter de tentativas — a razão entre eles é a taxa de falha |
| Fila/threadpool | tamanho da fila, workers em uso, workers totais, tarefas processadas, duração e espera na fila |
| Cache | consultas, hits, latência — e as métricas do sistema atrás do cache |
| Logging | counter por linha de erro/warning logada; compare entre releases |
| Collector customizado | gauge de duração da coleta e gauge de erros (exceção legítima de duração-como-gauge) |

## Armadilhas de série

- **Série que só nasce quando o evento acontece** quebra `rate()` e alertas. Inicialize em `0` toda série conhecida de antemão (com labels: chame `labels(...)`/`With(...)` no boot para cada combinação válida).
- **Inner loop quente** (>100k chamadas/s por processo): minimize métricas no loop, evite label lookup repetido (cacheie o retorno de `labels()`/`With()`), cuidado com medição de tempo (syscall) — e meça com benchmark antes de aceitar o custo.
- **UTF-8**: desde o Prometheus 3 nomes UTF-8 são aceitos, mas o padrão do playbook continua `snake_case` ASCII — interoperabilidade com todo o ecossistema (exporters, dashboards, PromQL sem aspas).
- **Native histograms** (estáveis desde 3.8, scrape opt-in): melhor resolução por fração do custo de buckets fixos — adote quando o client da stack suportar; até lá, buckets explícitos desenhados em torno do SLO.

## Padrão-ouro mínimo (Node/NestJS, `prom-client`)

```ts
import { Registry, Histogram, Counter, collectDefaultMetrics } from 'prom-client';

export const registry = new Registry();
collectDefaultMetrics({ register: registry }); // runtime: nunca redefinir

export const httpDuration = new Histogram({
  name: 'acme_app_http_request_duration_seconds',
  help: 'Duração das requisições HTTP',
  labelNames: ['method', 'route', 'status'] as const, // conjuntos fechados
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5], // em torno do SLO (p99 < 1s)
  registers: [registry],
});

export const cepLookups = new Counter({
  name: 'acme_app_cep_lookup_total',
  help: 'Consultas de CEP por provedor e resultado',
  labelNames: ['provider', 'status'] as const, // jamais o CEP em si
  registers: [registry],
});
```

`route` deve ser o **template** da rota (`/users/:id`), nunca a URL real — URL real é cardinalidade aberta.
