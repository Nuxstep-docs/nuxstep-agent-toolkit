#!/usr/bin/env node
/**
 * Hook PreToolUse(Write|Edit|MultiEdit / write_file|edit_file) do plugin Nuxstep.
 *
 * Duas garantias antes de qualquer escrita em disco pelo agente:
 *  1. Nunca gravar segredos literais (chaves privadas PEM, tokens GitHub, API keys
 *     sk-*, AWS AKIA*, Slack xox*) em código ou configuração (security-guardrails).
 *  2. Nunca editar manualmente um render gerado (arquivos marcados com
 *     "ARQUIVO GERADO ... NÃO EDITE" no cabeçalho ou cópias em
 *     marketplace/nuxstep/{skills,agents,rules}/) — a edição deve ser feita na
 *     fonte canônica seguida do script gerador (AGENTS.md / STRATEGY.md §2).
 *
 * Protocolos suportados:
 *  - Claude Code: { tool_name, tool_input: { file_path, content, new_string, edits } }
 *    → exit 0 permite; stderr + exit 2 bloqueia.
 *  - Antigravity: { hookEventName: "PreToolUse", toolCall: { name, args: { Path, Content, Replacement, ... } } }
 *    → stdout JSON { decision: "allow" } ou { decision: "deny", reason } com exit 0.
 */
const fs = require('fs');
const path = require('path');

// Regexes construídas dinamicamente onde necessário para não disparar o scanner
// estático de segredos do publish-mirror sobre o próprio código do guard.
const PEM_RE = new RegExp('-----BEGIN ' + '(?:[A-Z0-9 ]+ )?' + 'PRIVATE KEY-----');
const GH_TOKEN_RE = new RegExp('\\b(ghp_' + '[A-Za-z0-9]{20,}|github_pat_' + '[A-Za-z0-9_]{20,})\\b');
const SK_KEY_RE = new RegExp('\\bsk-' + '(?:proj-|ant-)?[A-Za-z0-9_-]{20,}\\b');
const AWS_KEY_RE = new RegExp('\\bAKIA' + '[0-9A-Z]{16}\\b');
const SLACK_TOKEN_RE = new RegExp('\\bxox[baprs]-' + '[A-Za-z0-9-]{10,}\\b');

const SECRET_CHECKS = [
  [PEM_RE, 'chave privada PEM'],
  [GH_TOKEN_RE, 'token GitHub (ghp_ / github_pat_)'],
  [SK_KEY_RE, 'API key (sk-*)'],
  [AWS_KEY_RE, 'AWS Access Key ID (AKIA*)'],
  [SLACK_TOKEN_RE, 'token Slack (xox*)'],
];

const GENERATED_HEADER_RE = /<!--\s*ARQUIVO GERADO[^\n]*N[ÃA]O EDITE/i;
const GENERATED_PLUGIN_COPY_RE = /(?:^|[/\\])marketplace[/\\]nuxstep[/\\](skills|agents|rules)[/\\]/;
const TEST_OR_SCANNER_FILE_RE = /(?:\.(test|spec)\.[a-z]+$|[/\\](?:scan-injection\.ts|publish-mirror\.ts|guard-write\.js|injection-allowlist\.json)$)/i;

let isAntigravity = false;

function block(reason) {
  const message = `[nuxstep-guard] BLOQUEADO: ${reason}`;
  if (isAntigravity) {
    process.stdout.write(JSON.stringify({ decision: 'deny', reason: message }) + '\n');
    process.exit(0);
  }
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

function allow() {
  if (isAntigravity) {
    process.stdout.write(JSON.stringify({ decision: 'allow' }) + '\n');
  }
  process.exit(0);
}

function extractTarget(payload) {
  if (isAntigravity) {
    const args = payload?.toolCall?.args ?? {};
    const filePath = String(args.Path ?? args.TargetFile ?? args.file_path ?? '');
    const chunks = Array.isArray(args.ReplacementChunks)
      ? args.ReplacementChunks.map((c) => c?.ReplacementContent ?? '').join('\n')
      : '';
    const text = [args.Content, args.Replacement, chunks].filter(Boolean).join('\n');
    return { filePath, text };
  }
  const inp = payload?.tool_input ?? {};
  const filePath = String(inp.file_path ?? inp.path ?? '');
  const multi = Array.isArray(inp.edits) ? inp.edits.map((e) => e?.new_string ?? '').join('\n') : '';
  const text = [inp.content, inp.new_string, multi].filter(Boolean).join('\n');
  return { filePath, text };
}

function check(filePath, text) {
  if (filePath) {
    // 1. Cópias geradas do plugin (marketplace/nuxstep/{skills,agents,rules}/)
    if (GENERATED_PLUGIN_COPY_RE.test(filePath)) {
      block(
        `edição manual em cópia gerada do plugin (${filePath}). Edite a fonte canônica (skills/, agents/ ou scripts/sync-plugin.ts) e rode sync-plugin.ts (AGENTS.md).`
      );
    }

    // 2. Arquivos existentes marcados com cabeçalho "<!-- ARQUIVO GERADO ... NÃO EDITE"
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const fd = fs.openSync(filePath, 'r');
        const buf = Buffer.alloc(256);
        const bytesRead = fs.readSync(fd, buf, 0, 256, 0);
        fs.closeSync(fd);
        const head = buf.subarray(0, bytesRead).toString('utf-8');
        if (GENERATED_HEADER_RE.test(head)) {
          block(
            `edição direta de artefato gerado (${path.basename(filePath)}). Edite a fonte canônica no hub e rode o gerador correspondente (cli-sync sync, sync-plugin.ts ou build-preset.ts).`
          );
        }
      }
    } catch {
      /* arquivo inacessível — não bloquear */
    }
  }

  // 3. Segredos literais no conteúdo escrito
  if (text && !TEST_OR_SCANNER_FILE_RE.test(filePath)) {
    for (const [re, label] of SECRET_CHECKS) {
      if (re.test(text)) {
        block(
          `possível ${label} hardcoded ao gravar ${filePath || 'arquivo'} (global-standards/security-guardrails §1). Injete segredos via variável de ambiente ou cofre.`
        );
      }
    }
  }
}

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(input || '{}');
    if (payload && (payload.toolCall !== undefined || payload.hookEventName !== undefined)) {
      isAntigravity = true;
    }
    const { filePath, text } = extractTarget(payload);
    check(filePath, text);
  } catch {
    // Fail-open para payloads inesperados
  }
  allow();
});
