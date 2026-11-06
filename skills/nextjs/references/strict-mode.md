# Modo Estrito — Next.js

Regras adicionais, aplicáveis SOMENTE quando o `AGENTS.md` do projeto declarar `Rigor do projeto: strict`.

1. **e2e Playwright obrigatório** nos fluxos críticos (login, checkout/ação principal, erro de validação) rodando no CI.
2. **Orçamento de bundle** — limite de JS client por rota monitorado no CI (`next build` + análise); estourou, o PR justifica ou corta.
3. **Toda Server Action com teste** — validação (payload inválido → erro), autorização (sem sessão → recusa) e invalidação (tag revalidada).
4. **Zero `any` nos contratos de página** — params/searchParams tipados e validados com schema (herda `typescript` strict).
5. **Imagens auditadas** — `next/image` com `sizes` corretos nas rotas principais; LCP das páginas-chave acompanhado (Web Vitals no monitoramento do projeto).
6. **Headers de segurança explícitos** — CSP, `frame-ancestors` e afins definidos em `next.config`/middleware e revisados em PR.
