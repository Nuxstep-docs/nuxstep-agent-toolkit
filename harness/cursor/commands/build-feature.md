# /build-feature

Você vai conduzir o ciclo Spec-Driven completo da feature: **$ARGUMENTS**

Papel de cada peça: os prompts/workflows definem O QUE produzir em cada fase; os subagents executam os papéis (implementer desenvolve, code-reviewer dá o veredito); você, sessão principal, é o ORQUESTRADOR — não implementa nem revisa diretamente as fases 4–5.

Projetos com `.specify/` (GitHub Spec Kit instalado) podem preferir os comandos `speckit-*` para as fases 1–3; este comando funciona em qualquer projeto usando o motor do hub.

## Fase 0 — Fundação (só se faltar)

Se não existir `specs/00-constitution.md`: crie a estrutura (`specs/`, `specs/features/`, `specs/adr/`) a partir dos templates SDD, localizados **na primeira fonte disponível desta cadeia**: tool MCP `get_spec_kit_template` → `$NUXSTEP_HUB/spec-kit/templates/` → `__NUXSTEP_TOOLKIT_HOME__/spec-kit/templates/` (instalados pelo toolkit). Tipos: `constitution` e `architecture`. Entreviste o humano BREVEMENTE (3–5 perguntas: propósito do sistema, stack pretendida — valide com `get_approved_stack` —, restrições inegociáveis) e preencha a constitution. Dúvida de arquitetura relevante? Delegue ao subagent `architect-advisor` antes de fixar decisões.

## Fases 1–3 — Especificação

Siga os workflows SDD (um motor só — os mesmos dos prompts MCP `spec-*`), lidos pela mesma cadeia de fontes da Fase 0 (`.../spec-kit/workflows/`):

1. **SPECIFY** — `spec-kit/workflows/specify.prompt.md` + template `feature-spec`: entreviste o usuário SEM falar de código; gere `specs/features/<feature>/spec.md`. **Pare e confirme a spec com o humano antes de seguir.**
2. **PLAN** — `spec-kit/workflows/plan.prompt.md` + template `feature-plan`: leia `.ai-config.json`, carregue as skills ativas, aplique os **Gates Nuxstep** (stack aprovada, arquitetura, banco, observabilidade, segurança, testes). Gate reprovado sem ADR bloqueia a fase seguinte.
3. **TASKS** — `spec-kit/workflows/tasks.prompt.md` + template `feature-tasks`: tasks atômicas (≤3 arquivos) com **comando de verificação determinística** cada.

## Fase 4 — Implementação com revisão (por task)

Para CADA task do `tasks.md`, nesta ordem:

1. Delegue ao subagent **`implementer`** com: a task literal, o caminho da spec/plan e o comando de verificação. Ele trabalha em worktree isolado, com TDD.
2. Rode o **comando de verificação** da task e a suíte de testes na íntegra. Falhou → volta ao implementer com a saída real do runner.
3. Delegue ao subagent **`code-reviewer`** o diff da task (ele checa aderência à spec e aos padrões).
4. Veredito:
   - **Aprovado** (ou ressalvas não-bloqueantes) → marque `[x]` no tasks.md e siga para a próxima task.
   - **Reprovado** → devolva ao implementer com os achados bloqueantes. **Máximo 3 iterações por task**; na 3ª reprovação, PARE e apresente ao humano: achados persistentes, o que foi tentado, opções.
5. Nunca apague/afrouxe teste vermelho para "ficar verde" (skill `tdd` — regra inegociável).

## Fase 5 — CI/CD (opcional, pergunte antes)

Se o humano quiser: delegue ao implementer a criação dos workflows com a skill `github-actions` (testes no PR obrigatórios; deploy conforme a skill da plataforma — `vercel`, `azure`, `kubernetes`...). Deploy de produção sempre atrás de Environment com aprovação.

## Regras do orquestrador

- **Commit/push/merge só com autorização textual do humano** (mesma regra das skills `github-develop-issue`/`github-review-pr`). Sem autorização, pare no working tree + relatório.
- Cada fase termina com um checkpoint visível de 2–4 linhas (o que foi produzido, o que vem a seguir).
- Falta informação que só o humano tem? Pergunte na hora — não invente requisito (registre suposições no plan quando forem razoáveis).
- Ao final: resumo da feature — tasks concluídas, cobertura do que a spec pedia, pendências/follow-ups.
