# Core Web Vitals — causas e correções

As três métricas que o Google mede em usuários reais (CrUX) e que afetam SEO e conversão. Meça antes e depois: PageSpeed Insights (dados de campo + lab), Lighthouse (lab), e o relatório CWV do Search Console.

## LCP — Largest Contentful Paint (alvo < 2,5s)

O maior elemento visível carregou tarde. Causas → correções:

| Causa | Correção |
|---|---|
| Imagem hero pesada/tardia | Formato moderno (AVIF/WebP), `srcset`/`sizes` corretos, `fetchpriority="high"` + `loading="eager"` SÓ no hero, preload quando vem de CSS |
| Render bloqueado | CSS crítico enxuto; JS de terceiros com `defer`; fontes com `font-display: swap` + preload da fonte do título |
| Servidor lento (TTFB) | Cache de página/CDN; no WordPress, cache de página é obrigatório; no Next, componente servidor + cache declarado |

## INP — Interaction to Next Paint (alvo < 200ms)

Interação que demora a responder. Causas → correções:

| Causa | Correção |
|---|---|
| Long tasks de JS no clique | Quebre trabalho longo (`scheduler.yield()`/chunks); feedback visual imediato antes do trabalho |
| Hidratação/JS demais | Menos JS no cliente (Server Components no Next; sem builder carregando bundle em página que não usa) |
| Handlers pesados em input | Debounce; derive no render em vez de efeito (skill `react`) |

## CLS — Cumulative Layout Shift (alvo < 0,1)

Conteúdo pulando. Causas → correções:

| Causa | Correção |
|---|---|
| Mídia sem dimensão | `width`/`height` (ou `aspect-ratio`) em TODA imagem/vídeo/embed |
| Fonte trocando tamanho | `font-display: swap` + `size-adjust`/fallback metricamente próximo |
| Conteúdo injetado no topo (banner, ad) | Reserve o espaço no layout; nunca insira acima do conteúdo existente |

## Orçamento prático (qualquer stack)

1. Página-chave com LCP/INP/CLS medidos ANTES de otimizar — intuição erra.
2. A otimização nº 1 quase sempre é **menos JavaScript e imagens certas** — não um plugin/truque.
3. Terceiros (analytics, chat, ads) entram com `defer`/facade e orçamento próprio; cada um é medido.
4. Re-meça no campo (CrUX leva ~28 dias) — lab verde com campo vermelho = teste de laboratório enganando.
