#!/usr/bin/env node
/**
 * Hook PreToolUse(Bash) do plugin Nuxstep — GARANTIA, não orientação.
 * Skills orientam o agente; este hook bloqueia o que não pode acontecer nunca,
 * citando o padrão violado (global-standards / skills).
 *
 * Protocolo de hooks do Claude Code: recebe JSON no stdin; exit 0 permite,
 * exit 2 bloqueia e devolve o stderr ao agente como feedback.
 */

const CONVENTIONAL = /\b(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?:\s?\S/;

function block(reason) {
  process.stderr.write(`[nuxstep-guard] BLOQUEADO: ${reason}\n`);
  process.exit(2);
}

function check(command) {
  const cmd = String(command ?? '');

  // 1. rm recursivo destrutivo em raiz/home/diretório atual
  const rmDanger =
    /\brm\s+(-[a-zA-Z]*[rR][a-zA-Z]*\s+)*-[a-zA-Z]*[rR][a-zA-Z]*(\s+\S+)*\s+(\/|\/\*|~|~\/\*|\$HOME(\/\*)?|\.|\.\.)(\s|$|;)/;
  if (rmDanger.test(cmd)) {
    block(
      'remoção recursiva de raiz/home/diretório atual. Se for realmente intencional, o humano deve rodar manualmente no terminal.'
    );
  }

  // 2. Push forçado — proíbe --force puro; --force-with-lease só fora de main/master
  if (/\bgit\s+push\b/.test(cmd)) {
    const hasPlainForce = /(\s--force\b|\s-f\b)/.test(cmd) && !/--force-with-lease/.test(cmd);
    const targetsTrunk = /\b(main|master)\b/.test(cmd);
    if (hasPlainForce) {
      block(
        'git push --force reescreve histórico publicado (global-standards/git-and-pr-standards). Use --force-with-lease em branch de feature, ou peça ao humano.'
      );
    }
    if (/--force-with-lease/.test(cmd) && targetsTrunk) {
      block('push forçado em main/master é proibido (global-standards/git-and-pr-standards).');
    }
  }

  // 3. Terraform sem revisão do plan
  if (/\bterraform\s+(apply|destroy)\b[^|&;]*-auto-approve/.test(cmd)) {
    block(
      'terraform apply/destroy -auto-approve pula a revisão do plan (skill terraform: mudanças de infra exigem revisão). Rode terraform plan e deixe o humano aprovar.'
    );
  }

  // 4. Conventional Commits (global-standards/git-and-pr-standards §2)
  if (/\bgit\s+commit\b/.test(cmd) && /(\s-m\b|--message\b)/.test(cmd)) {
    const isException = /(--amend|--fixup|--squash|-C\s|--no-edit)/.test(cmd);
    if (!isException && !CONVENTIONAL.test(cmd)) {
      block(
        'mensagem de commit fora do padrão Conventional Commits (global-standards/git-and-pr-standards §2). Formato: <tipo>(escopo): <descrição no imperativo> — tipos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.'
      );
    }
  }
}

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(input || '{}');
    check(payload?.tool_input?.command);
  } catch {
    // Payload ilegível: não bloqueia (fail-open) — garantia não pode virar negação de serviço.
  }
  process.exit(0);
});
