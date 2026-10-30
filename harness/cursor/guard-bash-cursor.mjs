#!/usr/bin/env node
/**
 * Adaptador do guard-bash (protocolo Claude Code) para hooks do Cursor.
 *
 * O Cursor chama hooks com JSON próprio no stdin (beforeShellExecution envia o
 * comando a executar); o guard-bash.js espera o formato do Claude Code
 * ({ tool_input: { command } }). Este adaptador aceita os dois formatos,
 * normaliza e delega — exit 2 bloqueia nas duas ferramentas, com o motivo no
 * stderr devolvido ao agente.
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));

let raw = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input = {};
  try {
    input = JSON.parse(raw || '{}');
  } catch {
    process.exit(0); // payload inesperado: não bloquear por engano (fail-open)
  }
  const command = input?.tool_input?.command ?? input?.command ?? input?.cmd ?? '';
  if (!command) process.exit(0);

  const res = spawnSync('node', [path.join(here, 'guard-bash.js')], {
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command } }),
    encoding: 'utf-8',
  });
  if (res.stderr) process.stderr.write(res.stderr);
  process.exit(res.status ?? 0);
});
