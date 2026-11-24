# Derivando workflows de um upstream (forks)

Contexto: você mantém um fork e quer construir **um subconjunto** do que o CI do upstream constrói (um alvo, uma plataforma). Chamar o `workflow_call` original inteiro dispara tudo; derivar é legítimo — desde que feito com método, porque workflow copiado é código de terceiro rodando com os SEUS secrets.

## A técnica

1. **`workflow_call` sem seletor de alvo constrói tudo.** Antes de reusar, confira se o reusable aceita um input de alvo; sem isso, derive um subconjunto em vez de chamar o todo.
2. **Copie os jobs necessários verbatim, com a origem anotada** em comentário (`# origem: upstream/.github/workflows/flutter-build.yml @ <ref>, linhas X–Y`). Atualização futura vira cópia e diff, não reescrita.
3. **Derive as `env` por varredura, não de memória.** Extraia todas as referências dos passos copiados e compare com as declaradas:

   ```bash
   grep -oE '\benv\.[A-Z_]+' derived.yml | sort -u          # usadas
   # compare com o bloco env: declarado no topo/jobs
   ```

   O erro de env faltante costuma nomear OUTRA coisa (ex.: `'toolchain' is a required input` quando o que faltava era uma env de versão) — a varredura evita o diagnóstico enganoso.
4. **Mantenha os nomes de inputs do `workflow_call` original** ao declarar o seu `workflow_dispatch.inputs` — os passos copiados continuam usando `${{ inputs.x }}` sem edição.
5. **`workflow_dispatch` só é disparável se o arquivo existir no branch default.** O código construído, porém, é o do `--ref` escolhido no disparo — o arquivo registra, o ref decide.
6. **Copiar verbatim herda o pinning por SHA de graça** quando o upstream pina. Confirme com varredura — todo `uses:` de terceiro deve casar SHA de 40 hex:

   ```bash
   grep -nE 'uses:.*@' derived.yml | grep -vE '@[0-9a-f]{40}|actions/'
   # saída vazia = tudo pinado (ou oficial)
   ```

## Auditoria antes do primeiro run (obrigatória)

1. **Procure ações de release em TODO `uses:` copiado** (`gh-release`, `create-release`, `upload-release-asset`...). Job de upstream copiado pode **publicar release no SEU fork** — remova ou condicione antes do primeiro disparo.
2. **Confira os caminhos de upload que sobraram.** Upload de artefato costuma ter condição composta (flag de upload E flag de metadata E certificado presente), e o caminho "alternativo" pode ser publicar release. Remover um passo sem mapear as condições produz **run verde e nenhum arquivo** — ou o arquivo no lugar errado.
3. **Secret ausente é interruptor silencioso.** `env: X: ${{ secrets.X }}` com secret inexistente vira string vazia, e `if: env.X != null` passa a pular o passo **sem erro**. Ao derivar, declare explicitamente `X: ""` nos secrets que você decidiu não ter — o salto vira decisão escrita, não efeito colateral:

   ```yaml
   env:
     MACOS_CODESIGN_IDENTITY: ""   # decisão: build sem assinatura (sem Developer ID)
   ```

Pronto quando: varredura de `env` sem faltantes, nenhum `uses:` de release ativo sem intenção, condições de upload mapeadas e secrets ausentes declarados vazios com comentário.
