# Alertas e regras

## Filosofia

- **Sintoma, não causa**: page quando o usuário sente (latência na borda, erro visível, dados atrasados); causas (CPU, fila interna, componente lento que não vazou para a borda) ficam no console para diagnóstico.
- **Poucos alertas, todos acionáveis**: page sem ação possível treina a equipe a ignorar pages. Exceção para page sem dor visível: falha grave que exige humano (ex.: perda financeira).
- **Folga sempre**: todo alerta tem `for` (absorve oscilação) e margem no limiar.
- Todo alerta linka o console (e runbook, se existir) no `annotations`.

## Por tipo de sistema

- **Online-serving**: alerte latência e taxa de erro **o mais alto possível na stack** (na borda). Latência pageia em UM ponto só — componente interno lento com borda saudável não é page. Tipos de requisição com perfis muito diferentes (ou baixo tráfego que se dilui) ganham alertas separados.
- **Offline processing**: alerte no tempo de travessia quando ele atinge o usuário.
- **Batch**: alerte se não houve sucesso há tempo suficiente para **2 execuções completas** (job de 4h/4h → limiar ≥ 10h). Se UMA falha já exige humano, o job roda pouco — aumente a frequência.
- **Capacidade**: perto do limite é ticket/aviso, não page — exige ação, mas não às 3h da manhã.

## Recording rules

- Nomeie `nivel:metrica:operacao` (ex.: `job:http_request_duration_seconds:p99_5m`) — dois-pontos SÓ aqui, nunca em instrumentação.
- Crie recording rule quando a mesma expressão cara aparece em dashboards/alertas; alerta avalia a rule, não a expressão repetida.

## Exemplo padrão-ouro

```yaml
groups:
  - name: acme-app
    rules:
      - record: job:acme_app_http_error_ratio:5m
        expr: |
          sum by (job) (rate(acme_app_http_request_duration_seconds_count{status=~"5.."}[5m]))
          / sum by (job) (rate(acme_app_http_request_duration_seconds_count[5m]))
      - alert: HighErrorRatio
        expr: job:acme_app_http_error_ratio:5m > 0.01
        for: 5m                       # folga contra oscilação
        labels:
          severity: page              # page | ticket
        annotations:
          summary: "{{ $labels.job }}: erros acima de 1% por 5m"
          dashboard: "https://grafana.example.com/d/app-red"
```

## Alertmanager

- `severity` (`page`/`ticket`) decide a rota (on-call vs. issue/canal); grouping por `alertname`+`job` evita tempestade de notificações; inhibition faz a causa-raiz silenciar os derivados (ex.: datacenter fora inibe alertas dos serviços dele).

## Metamonitoramento

- O monitor também cai: prefira um teste **blackbox ponta a ponta** (push → Prometheus → Alertmanager → notificação) a um alerta por componente, e tenha um verificador externo mínimo (uptime check) como última linha.
