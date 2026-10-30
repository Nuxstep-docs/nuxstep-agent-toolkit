# Scan de segurança no pipeline

Três camadas no PR, cada uma pegando uma classe de problema — scanner pega o genérico; a revisão (humana/agente) pega a lógica de negócio que ferramenta não vê. Nenhuma camada substitui a outra.

## 1. Segredos (gitleaks, sobre o diff)

Varre **só os commits novos** (PR: `origin/<base>...HEAD`; push: `github.event.before..HEAD` — no push o `base_ref` é vazio). O checkout precisa de `fetch-depth: 0` para o diff existir. Binário baixado com **checksum conferido** (cadeia de suprimentos — mesma disciplina do pin por SHA):

```yaml
- name: gitleaks (commits novos)
  env:
    GITLEAKS_VERSION: "8.30.1"           # confira a release atual
    GITLEAKS_SHA256: "<sha256 da linha linux_x64 do checksums.txt da release>"
  run: |
    TARBALL="gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
    curl -sSfLO "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/${TARBALL}"
    echo "${GITLEAKS_SHA256}  ${TARBALL}" | sha256sum --check --strict
    tar -xzf "$TARBALL" gitleaks
    ./gitleaks git --log-opts="${DIFF_FROM}..HEAD" --redact --exit-code 1 --no-banner .
```

`--redact` sempre: o log do CI não pode virar o vazamento. Complemento de plataforma: **push protection** do GitHub (secret scanning) quando o plano do repo oferece.

## 2. Dependências (SCA)

Falha em `high`/`critical`; o resto vira issue, não bloqueio (ruído treina o time a ignorar o check):

- Node: `npm audit --audit-level=high` (ou `pnpm audit`/`yarn npm audit`).
- Qualquer ecossistema: `dependency-review-action` no PR (bloqueia dependência NOVA vulnerável — barato e sem falso positivo de base antiga) e **Dependabot alerts/updates** ligados no repo.
- Alternativa multi-linguagem: osv-scanner.

## 3. SAST (análise estática de segurança)

- **Semgrep** com os packs da linguagem + OWASP, só severidade alta, imagem **fixada por digest**:

```yaml
- name: Semgrep
  run: |
    docker run --rm -v "$PWD:/src" -w /src semgrep/semgrep:<versão>@sha256:<digest> \
      semgrep scan --config p/owasp-top-ten --config p/<linguagem> \
      --severity ERROR --error --metrics off
```

- Alternativa nativa GitHub: **CodeQL** (`github/codeql-action`) — melhor integração com o Security tab; exige Advanced Security em repo privado (grátis em público).
- Container indo para produção: **Trivy** na imagem antes do push ao registry (skill `kubernetes`).

## Disciplina de supressão (a regra que mantém o scan vivo)

Falso positivo se suprime **no arquivo da ferramenta, caso a caso, com o motivo ao lado**: `.gitleaksignore` (fingerprint do achado), comentário `nosemgrep: <regra> -- <motivo>`, allowlist do audit. **Nunca**: desligar uma regra inteira, `continue-on-error` no job, ou `--audit-level=none` "temporário" — scanner silenciado é pior que scanner ausente, porque gera falsa confiança.

## Integração

- Os jobs de scan são **checks exigidos** no ruleset da branch protegida — nome de job estável (renomear quebra o ruleset).
- Rode no PR E no push das branches de ambiente (o push pega o que entrou por outros caminhos).
- Workflows de scan seguem as regras do corpo: `permissions: contents: read`, pin por SHA, `timeout-minutes`.
