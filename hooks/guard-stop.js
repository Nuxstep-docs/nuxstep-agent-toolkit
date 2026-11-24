#!/usr/bin/env node
/**
 * Hook Stop do plugin Nuxstep — Gate de Verificação antes de encerrar o turno.
 *
 * Impede que o agente encerre o turno e reporte "pronto" em 3 situações:
 *  1. Arquivos modificados com marcadores de conflito Git não resolvidos (<<<<<<< / >>>>>>>).
 *  2. Drift entre fontes canônicas (skills/ ou agents/) e cópias geradas em
 *     marketplace/nuxstep/ dentro do hub (lembra de rodar sync-plugin.ts).
 *  3. Código de aplicação (.ts, .tsx, .java, .py, .php, .dart, .go...) editado
 *     nesta rodada sem nenhum comando de verificação/teste executado após a edição
 *     (regra anti-fraude da skill tdd).
 *
 * Anti-loop: respeita `stop_hook_active` (Claude Code) e `continuationActive` /
 * `executionNum > 0` (Antigravity) — nunca bloqueia mais de uma vez no mesmo turno.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CODE_EXT_RE = /\.(ts|tsx|js|jsx|mjs|cjs|java|kt|py|php|dart|go|rs|cs|rb)$/i;
const EDIT_TOOLS = new Set([
  'Edit',
  'Write',
  'MultiEdit',
  'edit_file',
  'write_file',
  'replace_file_content',
  'multi_replace_file_content',
  'write_to_file',
]);
const CMD_TOOLS = new Set(['Bash', 'run_command']);
const CONFLICT_START_RE = /^<<<<<<< /m;
const CONFLICT_END_RE = /^>>>>>>> /m;

let isAntigravity = false;

function allowStop() {
  if (isAntigravity) {
    process.stdout.write(JSON.stringify({ decision: 'allow' }) + '\n');
  }
  process.exit(0);
}

function requestContinue(reason) {
  const message = `[nuxstep-guard] ${reason}`;
  if (isAntigravity) {
    process.stdout.write(JSON.stringify({ decision: 'continue', reason: message }) + '\n');
    process.exit(0);
  }
  process.stdout.write(JSON.stringify({ decision: 'block', reason: message }) + '\n');
  process.exit(0);
}

function checkGitWorkspace(cwd) {
  if (!cwd || !fs.existsSync(cwd)) return null;
  const res = spawnSync('git', ['status', '--porcelain'], {
    cwd,
    encoding: 'utf-8',
    timeout: 2000,
  });
  if (res.status !== 0 || !res.stdout) return null;

  const lines = res.stdout.split('\n').filter((l) => l.trim().length > 0);
  const modifiedFiles = [];
  for (const line of lines) {
    if (line.startsWith('D ') || line.startsWith(' D')) continue;
    const rawPath = line.slice(3).trim().replace(/^"|"$/g, '');
    const finalPath = rawPath.includes(' -> ') ? rawPath.split(' -> ').pop() : rawPath;
    if (finalPath) modifiedFiles.push(finalPath);
  }

  // 1. Marcadores de conflito Git deixados em arquivo modificado
  for (const rel of modifiedFiles) {
    const abs = path.join(cwd, rel);
    try {
      if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
      const stat = fs.statSync(abs);
      if (stat.size > 512 * 1024) continue;
      const content = fs.readFileSync(abs, 'utf-8');
      if (CONFLICT_START_RE.test(content) && CONFLICT_END_RE.test(content)) {
        return `O arquivo "${rel}" contém marcadores de conflito Git não resolvidos (<<<<<<< / >>>>>>>). Resolva o conflito antes de concluir.`;
      }
    } catch {
      /* ignorar erro de leitura */
    }
  }

  // 2. Drift canônico → plugin no hub (skills/ ou agents/ alterados sem sync-plugin.ts)
  const syncScript = path.join(cwd, 'scripts', 'sync-plugin.ts');
  const pluginDir = path.join(cwd, 'marketplace', 'nuxstep');
  if (fs.existsSync(syncScript) && fs.existsSync(pluginDir)) {
    for (const rel of modifiedFiles) {
      if (rel.startsWith('skills/') || rel.startsWith('agents/')) {
        const srcAbs = path.join(cwd, rel);
        const destAbs = path.join(pluginDir, rel);
        try {
          if (fs.existsSync(srcAbs) && fs.statSync(srcAbs).isFile()) {
            const srcText = fs.readFileSync(srcAbs, 'utf-8');
            const destText = fs.existsSync(destAbs) ? fs.readFileSync(destAbs, 'utf-8') : '';
            if (srcText !== destText) {
              return `Fonte canônica "${rel}" foi alterada, mas a cópia em marketplace/nuxstep/${rel} está desatualizada. Rode scripts/sync-plugin.ts antes de concluir.`;
            }
          }
        } catch {
          /* ignorar */
        }
      }
    }
  }

  return null;
}

function extractEditedFileFromCall(name, args) {
  if (!EDIT_TOOLS.has(name) || !args) return '';
  return String(args.Path ?? args.TargetFile ?? args.file_path ?? args.path ?? '');
}

function checkTranscriptForUnverifiedCodeEdit(transcriptFile) {
  if (!transcriptFile || !fs.existsSync(transcriptFile)) return null;
  let raw = '';
  try {
    const stat = fs.statSync(transcriptFile);
    const readSize = Math.min(stat.size, 128 * 1024);
    const fd = fs.openSync(transcriptFile, 'r');
    const buf = Buffer.alloc(readSize);
    fs.readSync(fd, buf, 0, readSize, stat.size - readSize);
    fs.closeSync(fd);
    raw = buf.toString('utf-8');
  } catch {
    return null;
  }

  const lines = raw.split('\n').filter((l) => l.trim().startsWith('{'));
  let lastEditedCodeFile = null;
  let commandRanAfterEdit = false;

  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    // Novo input do usuário zera o rastreamento para avaliar só o turno atual
    if (
      entry.type === 'USER_INPUT' ||
      entry.type === 'user' ||
      (entry.message && entry.message.role === 'user' && !Array.isArray(entry.message.content))
    ) {
      lastEditedCodeFile = null;
      commandRanAfterEdit = false;
      continue;
    }

    // Antigravity transcript format: tool_calls: [{ name, args }]
    const agyCalls = Array.isArray(entry.tool_calls) ? entry.tool_calls : [];
    for (const tc of agyCalls) {
      const name = tc?.name ?? '';
      const args = tc?.args ?? tc?.input ?? {};
      const file = extractEditedFileFromCall(name, args);
      if (file && CODE_EXT_RE.test(file)) {
        lastEditedCodeFile = path.basename(file);
        commandRanAfterEdit = false;
      } else if (CMD_TOOLS.has(name)) {
        commandRanAfterEdit = true;
      }
    }

    // Claude Code transcript format: message.content: [{ type: 'tool_use', name, input }]
    const ccContent = Array.isArray(entry?.message?.content) ? entry.message.content : [];
    for (const block of ccContent) {
      if (block?.type !== 'tool_use') continue;
      const name = block?.name ?? '';
      const args = block?.input ?? {};
      const file = extractEditedFileFromCall(name, args);
      if (file && CODE_EXT_RE.test(file)) {
        lastEditedCodeFile = path.basename(file);
        commandRanAfterEdit = false;
      } else if (CMD_TOOLS.has(name)) {
        commandRanAfterEdit = true;
      }
    }
  }

  if (lastEditedCodeFile && !commandRanAfterEdit) {
    return `Você alterou código-fonte (${lastEditedCodeFile}) neste turno e está encerrando sem executar um comando de verificação/teste após a edição (regra anti-fraude da skill tdd). Rode a verificação aplicável (testes, typecheck ou build) e confira a saída real antes de concluir.`;
  }
  return null;
}

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(input || '{}');
    if (
      payload &&
      (payload.hookEventName !== undefined ||
        payload.terminationReason !== undefined ||
        payload.continuationActive !== undefined)
    ) {
      isAntigravity = true;
    }

    // Anti-loop: se o hook Stop já manteve o agente rodando neste turno, permite parar.
    if (
      payload?.stop_hook_active === true ||
      payload?.continuationActive === true ||
      (typeof payload?.executionNum === 'number' && payload.executionNum > 0)
    ) {
      allowStop();
    }

    // No Antigravity, só avalia paradas normais (NO_TOOL_CALL).
    if (isAntigravity && payload?.terminationReason && payload.terminationReason !== 'NO_TOOL_CALL') {
      allowStop();
    }

    const cwd = payload?.cwd ?? (Array.isArray(payload?.workspacePaths) ? payload.workspacePaths[0] : process.cwd());
    const wsIssue = checkGitWorkspace(cwd);
    if (wsIssue) {
      requestContinue(wsIssue);
    }

    const transcriptFile = payload?.transcriptPath ?? payload?.transcript_path ?? '';
    const txIssue = checkTranscriptForUnverifiedCodeEdit(transcriptFile);
    if (txIssue) {
      requestContinue(txIssue);
    }
  } catch {
    // Fail-open
  }
  allowStop();
});
