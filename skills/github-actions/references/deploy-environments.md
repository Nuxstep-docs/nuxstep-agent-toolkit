# Deploy multi-ambiente — matrix × GitHub Environments

Os dois mecanismos têm papéis distintos e se compõem:

- **`strategy.matrix`** gera o LEQUE de jobs (um por ambiente/região) sem duplicar YAML.
- **GitHub Environment** dá a cada alvo suas REGRAS: aprovação manual, branch permitida, secrets/vars próprios e a URL do deploy visível no PR/run.

## Setup dos Environments (uma vez, por repo)

Settings → Environments: crie `staging` e `production`.

- `production`: **required reviewers** (aprovação humana), deployment branches = só `main`, secrets (`AZURE_CLIENT_ID`...) e variables (`APP_URL`) próprios.
- `staging`: sem aprovação; secrets/vars do alvo de staging.

## Blueprint

```yaml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write   # OIDC para a nuvem

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false   # deploy não se cancela no meio

jobs:
  deploy:
    strategy:
      fail-fast: false        # staging falhar não deve pular produção? decida; em cadeia use needs
      matrix:
        include:
          - env_name: staging
            runner: ubuntu-latest
          - env_name: production
            runner: ubuntu-latest
    runs-on: ${{ matrix.runner }}
    environment:
      name: ${{ matrix.env_name }}            # liga o job ao Environment: regras + secrets certos
      url: ${{ vars.APP_URL }}                # aparece como link no run/PR
    steps:
      - uses: actions/checkout@<sha40> # v5
      - uses: azure/login@<sha40> # v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}        # do Environment da vez
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - name: Deploy
        run: ./scripts/deploy.sh
        env:
          TARGET: ${{ matrix.env_name }}
```

Como se comporta: o job `staging` roda direto; o job `production` **pausa no gate** até a aprovação (protection rule do Environment) — mesma matriz, regras por alvo.

## Variações

- **Cadeia estrita** (prod só depois de staging verde): dois jobs com `needs: [deploy-staging]` em vez de matrix — mais verboso, ordem garantida.
- **Multi-região**: acrescente `region` à matriz e componha `environment.name: ${{ matrix.env_name }}-${{ matrix.region }}`.
- **Preview por PR**: Environment dinâmico `name: pr-${{ github.event.number }}` + job de teardown no `pull_request: closed`.

## Regras

1. Environment de produção SEMPRE com required reviewers + branch restrita.
2. Secret por Environment, nunca por repo, quando o valor difere por alvo.
3. `fail-fast: false` em matriz de deploy — um alvo falhar não deve abortar o outro no meio.
4. A URL (`environment.url`) preenchida — é o que torna o histórico de deploys navegável.
