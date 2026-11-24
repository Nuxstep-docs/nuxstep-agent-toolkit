---
name: php
description: >-
  Padrões da Nuxstep para PHP moderno (8.x): strict_types em tudo, tipos
  declarados, Composer/PSR, PDO com prepared statements, escape de saída e
  PHPStan. Use sempre que escrever ou alterar código PHP — classes, endpoints,
  scripts, temas/plugins WordPress — também em pedidos implícitos como "cria
  esse formulário em PHP", "corrige esse warning" ou "essa query está insegura"
  em projetos PHP.
license: Proprietary
metadata:
  globs: "**/*.php,composer.json"
  category: backend
  visibility: "public"
---

# PHP

Padrões para PHP moderno (versão vigente: tool MCP `get_approved_stack`; 8.5 é a linha atual). Escrevemos PHP 8 — nunca padrões da era 5: tipos, Composer e análise estática não são opcionais.

1. **`declare(strict_types=1)` em todo arquivo** — sem coerção silenciosa; tipos declarados em parâmetros, retornos e propriedades.
2. **Composer + PSR-4** — autoload por namespace; `require` manual é legado. Estilo PSR-12 via Pint/PHP-CS-Fixer (formatter decide, não o review).
3. **PHPStan desde o início** — nível ≥ 6 em projeto novo; análise estática é o "compilador" do PHP.
4. **Modele com o PHP de hoje** — enums para conjuntos fechados, `readonly` + constructor promotion para DTOs/VOs, `match` em vez de `switch`, named arguments em chamadas longas. Array associativo gigante não é objeto.
5. **SQL só com prepared statements** — PDO/stmt com placeholders; concatenação de SQL é vulnerabilidade, não estilo.
6. **Escape na saída** — `htmlspecialchars` (ou o escaper do template) em TODO dado que vai para HTML; XSS nasce do echo cru.
7. **Borda validada** — valide e tipe o request na entrada (framework ou filtros/Respect); `$_GET`/`$_POST` crus não circulam pela aplicação.
8. **Erros são exceções** — nada de `@` supressor nem retornos mistos `false|resultado`; senhas com `password_hash`/`password_verify`, sempre.
9. **Segredos fora do código** — env/secret manager; `composer.lock` commitado; dependências auditadas (`composer audit`).

## Testes (TDD)

**Pest** (PHPUnit em legado): unidade para o domínio puro, feature tests na borda do framework. Método: skill `tdd`; arquitetura: skill `software-architecture`.

## Não faça

- ❌ SQL concatenado com variável → ✅ prepared statement com placeholder
- ❌ `echo $dado` do usuário sem escape → ✅ `htmlspecialchars`/escaper do template
- ❌ `@funcao()` para silenciar erro → ✅ trate a exceção ou corrija a causa
- ❌ Array associativo como "entidade" atravessando camadas → ✅ classe tipada readonly
- ❌ Código estilo PHP 5 (mysql_*, sem tipos, global) → ✅ PHP 8 moderno

## Quando ler o quê

- [modern-php.md](references/modern-php.md) — os recursos do PHP 8.x que substituem os hábitos antigos (enums, readonly, property hooks, pipe operator, first-class callables). Leia ao modernizar código ou revisar padrões antigos.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
