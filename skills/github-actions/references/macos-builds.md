# Builds macOS no GitHub Actions

Regra transversal deste pack: **meça o fato antes de aceitar a explicação da ferramenta**. Nos incidentes que originaram estas regras, a mensagem de erro apontou para o lugar errado em todos os casos — o diagnóstico veio de `runner_name`, anotações do check-run, uma sonda de runners e os bytes do artefato, nunca do texto do erro.

## Runners macOS: label, arquitetura e alocação

1. **O nome do label é convenção; `RUNNER_ARCH` é a verdade.** Medido em 2026-11: `macos-15-intel` → `X64`, `macos-latest` → `ARM64`. A imagem de fato aparece no log do job na linha `Image:` (ex.: `Image: macos-26-arm64`). Nunca assuma arquitetura pelo nome.
2. **Label válido ≠ label disponível.** Um label aceito pela plataforma pode ter fila sem capacidade. Descubra qual atende com uma **sonda**: workflow `workflow_dispatch` com `matrix.os` dos candidatos e um único step de echo. Custa segundos por job e responde quem aloca E qual a arquitetura real. **Deixe a sonda versionada** — ela será necessária de novo.

   ```yaml
   # .github/workflows/probe-runners.yml — sonda de runners (mantenha no repo)
   name: probe-runners
   on: workflow_dispatch
   jobs:
     probe:
       strategy:
         fail-fast: false
         matrix:
           os: [macos-latest, macos-15, macos-15-intel, macos-14]
       runs-on: ${{ matrix.os }}
       timeout-minutes: 5
       steps:
         - run: echo "$RUNNER_OS $RUNNER_ARCH"
   ```

3. **Em macOS, o label móvel pode alocar MELHOR que o fixado** — o contrário do instinto de fixar tudo. Medido: `macos-15` (arm64) duas vezes sem runner até o timeout, enquanto `macos-latest` alocou na hora. O preço do móvel é a imagem mudar sem aviso: documente no job que, se o build quebrar após troca de imagem, roda-se a sonda e fixa-se o que ela mostrar.
4. **Larger runners não são o primeiro remédio.** Exigem plano pago e são cobrados por minuto mesmo em repositório público. Antes de pagar, meça — o problema pode ser uma palavra no label, não capacidade.
5. **Provedor terceiro de runner = self-hosted.** Eles se registram como self-hosted runner e caem na proibição de self-hosted em repositório público, por mais barato que o minuto pareça.

## Runbook: job "cancelled" sem log

Sintoma: job aparece como `cancelled`, sem log de step. Antes de tocar em código:

1. **Confira se o job chegou a ter runner**: `gh api /repos/{owner}/{repo}/actions/jobs/{job_id}` → campo `runner_name`. Vazio = o job **nunca foi alocado**; o problema é plataforma, não o seu código. Falha de step tem runner e log; falta de runner não tem nenhum dos dois.
2. **A causa real está na anotação do check-run** (que `gh run view --log` NÃO mostra): `gh api /repos/{owner}/{repo}/check-runs/{job_id}/annotations`. Dois sintomas idênticos têm causas opostas:
   - `The configuration '<label>' is not supported` → label **retirado/inexistente** (cancelamento em ~1 s);
   - `The job was not acquired by Runner of type hosted even after multiple attempts` → label válido, **fila sem capacidade** (cancelamento no timeout de alocação, ~15 min exatos).
3. **Label retirado** → rode a sonda (acima) e troque pelo label que aloca. **Fila sem capacidade** → tente o label móvel equivalente ou outra geração; re-runs no mesmo label só repetem a espera.
4. **Log de job pendurado não existe ainda** — logs só ficam legíveis depois que o run termina; cancele o run para poder ler o que há.

Pronto quando: a sonda confirma label + arquitetura, o job aloca em segundos e o motivo da escolha está comentado no workflow.

## Distribuição: assinatura e Gatekeeper

1. **Sem Developer ID, o artefato (DMG/app) sai sem assinatura** e o Gatekeeper bloqueia a primeira execução — equivalente ao SmartScreen no Windows. É **decisão de produto** (exige a assinatura anual paga do programa de desenvolvedores da Apple), não bug de build: registre a decisão antes de alguém instalar em máquina de cliente.
2. **Verifique o patch no binário certo.** Em apps com launcher + payload (ex.: Flutter + biblioteca nativa), o executável de entrada é só o runner — o código de verdade vive na biblioteca/bundle. Ao conferir se uma mudança entrou no artefato, inspecione o payload; procurar no launcher dá "ausente" e leva à conclusão errada.
