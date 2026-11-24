---
name: ui-design
description: >-
  Direção visual da Nuxstep para interfaces web: processo em dois passes (plano
  de tokens → crítica contra o brief → código), design ancorado no assunto,
  tipografia deliberada e a lista de "cara de template de IA" a evitar. Use ao
  criar ou redesenhar qualquer página/landing/UI onde a estética importa —
  também em pedidos implícitos como "deixa bonito", "cria a landing", "está com
  cara de genérico" ou "dá identidade pra isso".
license: Proprietary
metadata:
  globs: "**/*.tsx,**/*.jsx,**/*.html,**/*.css"
  category: frontend
  visibility: "public"
---

# Direção Visual (UI)

A mecânica vive na skill `html-css`; os sistemas, em `tailwindcss`/`material-design`. Esta skill cuida do que vem ANTES: decidir **como esta interface vai parecer — e por que só ela pode parecer assim**.

## 1. Ancore no assunto

Design distinto nasce do domínio: o setor, o vocabulário, os materiais e o público do produto ditam paleta, tipo e tom. Antes de desenhar, nomeie em uma linha: **assunto, público e o trabalho nº 1 da página**. Se o pedido não diz, proponha e confirme. Um brinquedo infantil e um painel financeiro não podem sair da mesma prancheta.

## 2. Dois passes, sempre

1. **Plano** (compacto, antes de qualquer código): 4–6 cores nomeadas em hex, as famílias tipográficas e seus papéis, o conceito de layout (uma frase + wireframe ASCII) e 2–3 princípios do que torna ESTA página única.
2. **Crítica contra o brief**: para cada escolha, pergunte "eu produziria isso para qualquer outro pedido parecido?" — se sim, é default, não escolha: revise e diga o que mudou. Só então escreva o código, seguindo o plano revisado.

## 3. Tipografia carrega a personalidade

Uma ou duas famílias (se duas, claramente distintas), escala tipográfica deliberada, linhas com menos de ~80 caracteres. O headline é elemento visual ativo, não veículo neutro do texto. Fuja dos cacoetes: uma palavra solta em itálico/cor na manchete, ALL-CAPS em todo rótulo, labels desnecessários sobre o conteúdo.

## 4. A lista do "cara de IA" (evite quando o brief deixa livre)

Todos legítimos quando o brief PEDE; como default, entregam template: fundo creme + serifa + acento terracota · dark com um único acento ácido · kit SaaS de cards idênticos (mesmo raio, mesma sombra cinza) com gradiente decorativo · eyebrow ALL-CAPS acima de cada heading · metadados unidos por "·" · seta "→" em todo botão · numeração 01/02/03 em conteúdo que não é sequência · fade-up de entrada em cada seção. **O brief sempre vence** — se ele pede um desses looks, siga exatamente.

## 5. Gaste a ousadia num lugar só

Um elemento memorável; tudo ao redor quieto e disciplinado. Antes de entregar, "tire um acessório": corte a decoração que não serve ao brief. Estrutura (bordas, divisores, numeração) codifica informação — não decora.

## 6. Movimento e copy

- Motion não-solicitado é raro e orquestrado: UM momento (um reveal de carga) vale mais que efeitos espalhados; motion que responde à ação do usuário é sempre bem-vindo; `prefers-reduced-motion` respeitado (skill `html-css`).
- **Copy é design**: placeholder genérico entrega template tanto quanto o layout — escreva o texto do assunto real.

## 7. Piso de qualidade, sem anunciar

Distinto nunca às custas do básico: responsivo até mobile, foco visível, contraste, acessibilidade e Core Web Vitals (skill `html-css` + pack `core-web-vitals.md`). E **valide vendo**: screenshots desktop+mobile antes de reportar (skill `playwright`).

## Não faça

- ❌ Ir direto ao código sem plano → ✅ dois passes (plano → crítica → build)
- ❌ Paleta/tipografia que você usaria em qualquer projeto → ✅ escolha derivada do assunto
- ❌ Conteúdo picado em cards idênticos → ✅ hierarquia onde a estrutura informa
- ❌ Ousadia espalhada em tudo → ✅ um elemento memorável, resto disciplinado
- ❌ Lorem ipsum/copy genérica na entrega → ✅ texto real do domínio

## Quando ler o quê

- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
