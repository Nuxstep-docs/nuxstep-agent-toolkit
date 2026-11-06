---
name: vercel
description: >-
  Padrões da Nuxstep para hospedagem na Vercel: previews por PR como artefato
  de revisão, env vars por ambiente, região da função perto do banco e spend
  management ligado. Use ao configurar deploy/domínio/env na Vercel — também em
  pedidos implícitos como "publica esse Next", "cria um preview pro cliente ver"
  ou "a fatura da Vercel veio alta".
license: Proprietary
metadata:
  globs: "vercel.json,.vercel/**"
  category: cloud
  visibility: "public"
---

# Vercel

Padrões para Vercel (recursos vigentes: tool MCP `get_approved_stack`). **Papel**: hosting default de projetos Next.js — o preview por PR é o superpoder; quando o projeto vira backend pesado ou o custo cresce, a escada continua nas skills `azure`/`digitalocean` (containers).

1. **Preview deployment é o artefato de revisão** — todo PR ganha URL própria: é NELA que a validação visual roda (skill `playwright`) e que o cliente aprova; "funciona na minha máquina" não é evidência.
2. **Env vars por ambiente** — Development/Preview/Production separados; segredo é server-side (a skill `nextjs` manda: `NEXT_PUBLIC_` só para o que pode vazar); valor de Preview NUNCA aponta para banco de produção.
3. **Branch de produção = `main`** — deploy de produção só por merge; promote manual é exceção documentada.
4. **Função perto do dado** — configure a região das functions na mesma região do banco (latência de ida e volta domina); banco gerenciado + Vercel em regiões distantes é a lentidão clássica.
5. **Spend management LIGADO desde o dia 1** — alertas e hard limit de gasto configurados; bandwidth e invocações escalam com tráfego (e com ataque) — fatura surpresa é incidente conhecido da plataforma.
6. **Deixe o framework trabalhar** — cache/ISR/imagens do Next funcionam nativamente (skill `nextjs`, data-and-cache); `vercel.json` mínimo — configuração vive no framework.
7. **Domínios com DNS deliberado** — custom domain com CNAME/NS documentado no projeto; wildcard/preview domains entendidos antes de expor cliente.
8. **Proteção nos previews** — deployment protection (senha/SSO) quando o conteúdo do preview é sensível; preview é URL pública por padrão.

## Não faça

- ❌ Segredo em `NEXT_PUBLIC_*` ou exposto no client → ✅ env server-side
- ❌ Preview apontando para banco de produção → ✅ banco/branch de dados de preview
- ❌ Produção sem spend alerts/limite → ✅ spend management no dia 1
- ❌ Função em região padrão com banco longe → ✅ co-locar função e banco
- ❌ Revisar UI sem o link do preview → ✅ preview por PR + validação playwright

## Quando ler o quê

- Skill `nextjs` → [data-and-cache.md](../nextjs/references/data-and-cache.md) — o cache que a Vercel serve é o declarado no framework.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
