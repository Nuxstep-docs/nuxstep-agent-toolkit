#!/usr/bin/env node
/**
 * Nuxstep Agent Toolkit — instalador multi-IDE (user-level).
 *
 * Copia skills (formato aberto Agent Skills), agents e comandos transpilados
 * para os diretórios que cada harness lê nativamente. Zero dependências
 * (Node >= 18). Fonte canônica: hub privado da Nuxstep (scripts/toolkit/);
 * distribuído no espelho público e no pacote npm @nuxstep/agent-toolkit.
 *
 * Uso:
 *   npx @nuxstep/agent-toolkit                  # checklist interativo
 *   npx @nuxstep/agent-toolkit --tools cursor,antigravity
 *   npx @nuxstep/agent-toolkit --hooks          # inclui o guard de shell no Cursor
 *   npx @nuxstep/agent-toolkit --list | --remove <ids|all> | --dry-run
 *
 * Claude Code NÃO está na lista de alvos: lá o canal é o plugin
 * (`claude plugin marketplace add Nuxstep-docs/nuxstep-agent-toolkit`) — gravar
 * em ~/.claude/skills duplicaria as skills do plugin.
 *
 * Ownership: só tocamos o que está registrado no manifesto
 * (~/.nuxstep/toolkit.json); atualizar = remover o que é nosso e copiar de
 * novo; --remove apaga apenas o rastreado.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline/promises';
import { fileURLToPath } from 'url';

const TOOLKIT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const home = () => process.env.HOME || os.homedir();
const toolkitHome = () => path.join(home(), '.nuxstep', 'toolkit');
const manifestPath = () => path.join(home(), '.nuxstep', 'toolkit.json');
const PLACEHOLDER = '__NUXSTEP_TOOLKIT_HOME__';

const pkg = JSON.parse(fs.readFileSync(path.join(TOOLKIT_ROOT, 'package.json'), 'utf-8'));

// ---------------------------------------------------------------- helpers

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};
const dryRun = flag('dry-run');
const withHooks = flag('hooks');

const actions = [];
function act(msg) {
  actions.push(msg);
  console.log(`  ${dryRun ? '[dry-run] ' : ''}✅ ${msg}`);
}
function warn(msg) {
  console.log(`  ⚠️  ${msg}`);
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

function copyDir(src, dest, tracked) {
  if (!dryRun) {
    fs.rmSync(dest, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
  }
  tracked.push(dest);
}

function copyFile(src, dest, tracked, transform) {
  if (!dryRun) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    let body = fs.readFileSync(src, 'utf-8');
    if (transform) body = transform(body);
    fs.writeFileSync(dest, body);
  }
  tracked.push(dest);
}

const expandHome = (body) => body.split(PLACEHOLDER).join(toolkitHome());

// URL do MCP remoto da Nuxstep (gravada no package.json pelo publish-mirror).
const MCP_URL = pkg.nuxstep?.mcpUrl;

/** Registra o MCP remoto num arquivo JSON de config, preservando o resto. */
function mergeMcp(file, rootKey, entry, mcpTracked) {
  if (!MCP_URL) return;
  let json = {};
  if (fs.existsSync(file)) {
    try {
      json = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      warn(`${file} não é JSON válido — registro do MCP pulado para não corromper; adicione o server "nuxstep" manualmente.`);
      return;
    }
  }
  json[rootKey] = json[rootKey] ?? {};
  json[rootKey].nuxstep = entry;
  if (!dryRun) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
  }
  mcpTracked.push({ file, rootKey });
  act(`MCP remoto registrado em ${file} (${rootKey}.nuxstep) — o harness pede login OAuth no primeiro uso`);
}

function dropMcp(mcpTracked = []) {
  for (const { file, rootKey } of mcpTracked) {
    try {
      const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (json?.[rootKey]?.nuxstep) {
        delete json[rootKey].nuxstep;
        fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
      }
    } catch {
      /* arquivo ausente/inválido — não tocar */
    }
  }
}

const vscodeUserDir = () =>
  process.platform === 'darwin'
    ? path.join(home(), 'Library', 'Application Support', 'Code', 'User')
    : process.platform === 'win32'
      ? path.join(process.env.APPDATA ?? path.join(home(), 'AppData', 'Roaming'), 'Code', 'User')
      : path.join(home(), '.config', 'Code', 'User');

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath(), 'utf-8'));
  } catch {
    return { version: pkg.version, tools: {}, shared: { paths: [] } };
  }
}

function saveManifest(manifest) {
  if (dryRun) return;
  manifest.version = pkg.version;
  fs.mkdirSync(path.dirname(manifestPath()), { recursive: true });
  fs.writeFileSync(manifestPath(), JSON.stringify(manifest, null, 2) + '\n');
}

function removeTracked(paths = []) {
  for (const p of paths) {
    // Segurança: só apagamos caminhos dentro do $HOME e nunca o próprio HOME.
    if (!p.startsWith(home()) || path.resolve(p) === path.resolve(home())) continue;
    fs.rmSync(p, { recursive: true, force: true });
  }
}

// ------------------------------------------------- hooks do Cursor (opt-in)

const GUARD_CMD = () => `node "${path.join(toolkitHome(), 'hooks', 'guard-bash-cursor.mjs')}"`;

function cursorHooksInstall(tracked, hooksTracked) {
  const file = path.join(home(), '.cursor', 'hooks.json');
  let json = { version: 1, hooks: {} };
  if (fs.existsSync(file)) {
    try {
      json = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      warn(`${file} não é JSON válido — hooks pulados para não corromper o arquivo.`);
      return;
    }
  }
  json.version = json.version ?? 1;
  json.hooks = json.hooks ?? {};
  json.hooks.beforeShellExecution = json.hooks.beforeShellExecution ?? [];
  const cmd = GUARD_CMD();
  if (!json.hooks.beforeShellExecution.some((h) => h && h.command === cmd)) {
    json.hooks.beforeShellExecution.push({ command: cmd });
    if (!dryRun) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
    }
  }
  hooksTracked.push(cmd);
  act(`Guard de shell registrado em ${file} (beforeShellExecution)`);
}

function cursorHooksRemove(hooksTracked = []) {
  const file = path.join(home(), '.cursor', 'hooks.json');
  if (!fs.existsSync(file) || hooksTracked.length === 0) return;
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return;
  }
  const arr = json?.hooks?.beforeShellExecution;
  if (!Array.isArray(arr)) return;
  json.hooks.beforeShellExecution = arr.filter((h) => !hooksTracked.includes(h?.command));
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
}

// ---------------------------------------------------------------- alvos

/**
 * Cada harness recebe as skills no SEU diretório nativo (um só, para não
 * duplicar a descoberta quando a ferramenta lê múltiplos caminhos).
 */
const TOOLS = [
  {
    id: 'cursor',
    label: 'Cursor (skills + subagents + comando + hooks opcionais)',
    install(tool) {
      const skillsDest = path.join(home(), '.cursor', 'skills');
      for (const s of listDirs(path.join(TOOLKIT_ROOT, 'skills'))) {
        copyDir(path.join(TOOLKIT_ROOT, 'skills', s), path.join(skillsDest, s), tool.paths);
      }
      act(`Skills em ${skillsDest}`);
      const agentsSrc = path.join(TOOLKIT_ROOT, 'harness', 'cursor', 'agents');
      if (fs.existsSync(agentsSrc)) {
        for (const f of fs.readdirSync(agentsSrc)) {
          copyFile(path.join(agentsSrc, f), path.join(home(), '.cursor', 'agents', f), tool.paths);
        }
        act(`Subagents em ${path.join(home(), '.cursor', 'agents')}`);
      }
      const cmdSrc = path.join(TOOLKIT_ROOT, 'harness', 'cursor', 'commands');
      if (fs.existsSync(cmdSrc)) {
        for (const f of fs.readdirSync(cmdSrc)) {
          copyFile(path.join(cmdSrc, f), path.join(home(), '.cursor', 'commands', f), tool.paths, expandHome);
        }
        act(`Comandos em ${path.join(home(), '.cursor', 'commands')}`);
      }
      mergeMcp(path.join(home(), '.cursor', 'mcp.json'), 'mcpServers', { url: MCP_URL }, tool.mcp);
      if (withHooks) cursorHooksInstall(tool.paths, tool.hooks);
      else warn('Hooks de garantia disponíveis com --hooks (bloqueiam rm -rf perigoso, force-push, terraform -auto-approve).');
    },
  },
  {
    id: 'vscode',
    label: 'VS Code / Copilot (skills + custom agents)',
    install(tool) {
      const skillsDest = path.join(home(), '.copilot', 'skills');
      for (const s of listDirs(path.join(TOOLKIT_ROOT, 'skills'))) {
        copyDir(path.join(TOOLKIT_ROOT, 'skills', s), path.join(skillsDest, s), tool.paths);
      }
      act(`Skills em ${skillsDest}`);
      const agentsSrc = path.join(TOOLKIT_ROOT, 'harness', 'copilot', 'agents');
      if (fs.existsSync(agentsSrc)) {
        for (const f of fs.readdirSync(agentsSrc)) {
          copyFile(path.join(agentsSrc, f), path.join(home(), '.copilot', 'agents', f), tool.paths);
        }
        act(`Custom agents em ${path.join(home(), '.copilot', 'agents')}`);
      }
      mergeMcp(path.join(vscodeUserDir(), 'mcp.json'), 'servers', { type: 'http', url: MCP_URL }, tool.mcp);
      warn('Prompt files do Copilot são por workspace (.github/prompts/) — não há equivalente user-level para o comando build-feature.');
    },
  },
  {
    id: 'antigravity',
    label: 'Antigravity (skills — o CLI as expõe também como /comandos)',
    install(tool) {
      const skillsDest = path.join(home(), '.gemini', 'config', 'skills');
      for (const s of listDirs(path.join(TOOLKIT_ROOT, 'skills'))) {
        copyDir(path.join(TOOLKIT_ROOT, 'skills', s), path.join(skillsDest, s), tool.paths);
      }
      act(`Skills em ${skillsDest}`);
      mergeMcp(path.join(home(), '.gemini', 'config', 'mcp_config.json'), 'mcpServers', { httpUrl: MCP_URL }, tool.mcp);
    },
  },
  {
    id: 'codex',
    label: 'Codex e compatíveis (skills no diretório compartilhado ~/.agents/skills)',
    install(tool) {
      const skillsDest = path.join(home(), '.agents', 'skills');
      for (const s of listDirs(path.join(TOOLKIT_ROOT, 'skills'))) {
        copyDir(path.join(TOOLKIT_ROOT, 'skills', s), path.join(skillsDest, s), tool.paths);
      }
      act(`Skills em ${skillsDest}`);
    },
  },
];

// ------------------------------------------------- recursos compartilhados

function installShared(manifest) {
  const dest = toolkitHome();
  const tracked = [];
  for (const dir of ['spec-kit', 'hooks']) {
    const src = path.join(TOOLKIT_ROOT, dir);
    if (fs.existsSync(src)) copyDir(src, path.join(dest, dir), tracked);
  }
  const adapter = path.join(TOOLKIT_ROOT, 'harness', 'cursor', 'guard-bash-cursor.mjs');
  if (fs.existsSync(adapter)) {
    copyFile(adapter, path.join(dest, 'hooks', 'guard-bash-cursor.mjs'), tracked);
  }
  manifest.shared = { paths: [dest], updatedAt: new Date().toISOString() };
  act(`Recursos compartilhados (spec-kit, hooks) em ${dest}`);
  void tracked;
}

// ---------------------------------------------------------------- fluxo

async function pickInteractive() {
  console.log('\nHarnesses disponíveis:');
  TOOLS.forEach((t, i) => console.log(`  ${i + 1}. ${t.label}`));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (
    await rl.question("\nQuais instalar? Números separados por vírgula (ex.: 1,3) ou 'a' para todos: ")
  ).trim();
  rl.close();
  if (answer.toLowerCase() === 'a') return TOOLS.map((t) => t.id);
  return [
    ...new Set(
      answer
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => n >= 1 && n <= TOOLS.length)
        .map((n) => TOOLS[n - 1].id)
    ),
  ];
}

async function main() {
  const manifest = loadManifest();

  if (flag('list')) {
    console.log(`Nuxstep Agent Toolkit v${pkg.version}`);
    console.log('Harnesses: ' + TOOLS.map((t) => t.id).join(', '));
    const installed = Object.keys(manifest.tools ?? {});
    console.log(installed.length ? `Instalados: ${installed.join(', ')} (manifesto: ${manifestPath()})` : 'Nada instalado ainda.');
    return;
  }

  const removeArg = opt('remove') ?? (flag('remove') ? 'all' : undefined);
  if (removeArg) {
    const ids = removeArg === 'all' ? Object.keys(manifest.tools ?? {}) : removeArg.split(',').map((s) => s.trim());
    for (const id of ids) {
      const entry = manifest.tools?.[id];
      if (!entry) {
        warn(`"${id}" não consta no manifesto — nada a remover.`);
        continue;
      }
      removeTracked(entry.paths);
      cursorHooksRemove(entry.hooks);
      dropMcp(entry.mcp);
      delete manifest.tools[id];
      console.log(`✅ ${id}: removido (só o que o toolkit instalou).`);
    }
    if (removeArg === 'all' && manifest.shared?.paths) {
      removeTracked(manifest.shared.paths);
      manifest.shared = { paths: [] };
      console.log('✅ Recursos compartilhados (~/.nuxstep/toolkit) removidos.');
    }
    saveManifest(manifest);
    return;
  }

  let ids;
  const toolsArg = opt('tools');
  if (toolsArg) {
    ids = toolsArg.split(',').map((s) => s.trim()).filter(Boolean);
    const unknown = ids.filter((id) => !TOOLS.some((t) => t.id === id));
    if (unknown.length) {
      console.error(`Harnesses desconhecidos: ${unknown.join(', ')}. Válidos: ${TOOLS.map((t) => t.id).join(', ')}`);
      process.exitCode = 1;
      return;
    }
  } else if (process.stdin.isTTY) {
    ids = await pickInteractive();
  } else {
    console.error(`Sem TTY: informe --tools <${TOOLS.map((t) => t.id).join('|')},...>`);
    process.exitCode = 1;
    return;
  }

  if (!ids.length) {
    console.log('Nada selecionado.');
    return;
  }

  console.log(`\nNuxstep Agent Toolkit v${pkg.version}${dryRun ? ' — DRY-RUN (nada será escrito)' : ''}`);
  installShared(manifest);

  for (const id of ids) {
    const def = TOOLS.find((t) => t.id === id);
    console.log(`\n▶ ${def.label}`);
    const previous = manifest.tools?.[id];
    if (previous && !dryRun) {
      removeTracked(previous.paths);
      cursorHooksRemove(previous.hooks);
    }
    const tool = { paths: [], hooks: [], mcp: [] };
    def.install(tool);
    manifest.tools[id] = { paths: tool.paths, hooks: tool.hooks, mcp: tool.mcp, installedAt: new Date().toISOString() };
  }

  saveManifest(manifest);
  console.log(`\nConcluído${dryRun ? ' (dry-run)' : ''}. Reinicie os harnesses para carregarem as skills.`);
  console.log('Claude Code? Use o plugin: claude plugin marketplace add Nuxstep-docs/nuxstep-agent-toolkit');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
