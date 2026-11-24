<!-- ARQUIVO GERADO POR scripts/sync-plugin.ts — NÃO EDITE À MÃO -->
# Padrões Nuxstep — Invariantes Globais e Gate de Skills

## 1. Invariantes Globais (Sempre Ativos)

Estes princípios valem em **qualquer projeto e turno**, antes mesmo de abrir uma skill:

- **Fluxo Spec-Driven (`00-spec-driven-workflow`)**: em projetos com `specs/`, siga o ciclo `[SPECIFY] → [PLAN] → [TASKS] → [IMPLEMENT]` (nenhum código de aplicação/infra sem spec correspondente, salvo pedido pontual explícito do humano).
- **Idiomas (`language-policy`)**: conversa no idioma do usuário; código (identificadores, arquivos, branches, schema) em **inglês**; prosa do projeto (comentários, docs, commits, PRs) em **PT-BR** — sem mistura.
- **TDD & Anti-fraude de testes (`tdd`)**: ciclo Red → Green → Refactor para regras de negócio e bug fixes; **nunca apague, pule (`skip`) ou afrouxe um teste vermelho para "ficar verde"**; nunca reporte sucesso sem executar a suíte e conferir a saída real; teste comportamento observável (Chicago no domínio, London nas bordas).
- **Qualidade & Comentários (`clean-code`, `code-comments`)**: nomes revelam intenção; erro nunca é silenciado (`catch` vazio proibido); comentários são exceção de 1 linha apenas para o *porquê* (restrição externa, decisão não óbvia ou armadilha); **proibido** commitar código comentado, `TODO` órfão ou anotações de trabalho do agente (notas descartáveis vão para scratchpad; memória local em `.ai/` git-ignorada; decisões duráveis em ADR/spec/`AGENTS.md`).
- **Segurança (`security-guardrails`)**: zero segredos/tokens/chaves no código ou Git; validação estrita de schema na borda (Zero Trust, *fail-fast*); queries sempre parametrizadas; TLS 1.2+ e hash moderno (`Argon2`/`bcrypt`/`scrypt`).
- **Observabilidade (`observability-baseline`)**: logs em produção sempre estruturados em JSON (`timestamp`, `level`, `service`, `traceId`, `message`), propagação de `traceId` e métricas RED (`/metrics`).
- **Git, PRs & Automação (`git-and-pr-standards`, `automation-first`)**: branches tipadas (`feat/`, `fix/`, `chore/`, `docs/`); **Conventional Commits obrigatório**; nunca force-push em `main`/`master`; para tarefas determinísticas/repetitivas (3+ arquivos ou parsing em massa), crie e execute um script idempotente em vez de operar manualmente.

## 2. Gate de Ativação de Skills (Conhecimento Estável)

- **Ativação obrigatória por tecnologia:** antes de criar, editar ou revisar código, banco ou infraestrutura em uma tecnologia coberta pelas skills instaladas na sessão (ou em `.agents/skills/` do projeto), **você DEVE ativar/ler o `SKILL.md` correspondente** (e os arquivos específicos em `references/`, como `auth.md`, `database.md`, `testing.md` ou `strict-mode.md` quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`).
- **Aprofundamento transversal:** ao desenhar camadas/módulos, refatorar smells/dívida técnica ou projetar dublês de teste, carregue as skills `software-architecture`, `clean-code` ou `tdd` e seus `references/`.

## 3. Servidor MCP `nuxstep` (Conhecimento Dinâmico)

- Nunca assuma versão ou escolha de tecnologia: consulte `get_approved_stack` no servidor MCP `nuxstep` quando disponível.
- Use `get_spec_kit_template` (ou os prompts `spec-*`) para conduzir o fluxo SDD e `nuxstep_bootstrap` para iniciar repositórios novos.
