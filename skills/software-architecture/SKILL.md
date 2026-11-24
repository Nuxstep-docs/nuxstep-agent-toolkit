---
name: software-architecture
description: >-
  Pilares arquiteturais da Nuxstep para qualquer backend: Hexagonal (Ports &
  Adapters — a preferência deste playbook), inversão de dependência, domínio
  independente de frameworks, dose certa de arquitetura por tamanho de projeto
  e organização de pastas por feature. Use sempre que desenhar a estrutura de
  um projeto ou módulo, definir camadas, criar use cases, repositórios ou
  integrações — e ao revisar código que mistura domínio com ORM/HTTP. Vale para
  qualquer linguagem (TypeScript, Java, C#, Go, Python, PHP, Dart).
license: Proprietary
metadata:
  globs: "**/*.ts,**/*.java,**/*.cs,**/*.go,**/*.py,**/*.php,**/*.dart"
  category: architecture
  visibility: "public"
---

# Arquitetura de Software

A preferência deste playbook é **Hexagonal (Ports & Adapters)**: negócio no centro, mundo externo atrás de interfaces. O objetivo é testabilidade e independência de banco, UI e APIs externas — não cerimônia.

## 1. As camadas

1. **Domain** — Entities, Value Objects e regras puras. Sem dependências de framework, ORM ou HTTP.
2. **Application (Use Cases)** — orquestra o fluxo: lê ports, valida estado, altera o domínio.
3. **Ports** — interfaces definidas PELO negócio: *driving/inbound* (como a aplicação é acionada, ex.: `CreateUserUseCase`) e *driven/outbound* (como ela acessa o mundo, ex.: `UserRepository`).
4. **Adapters** — as pontas: controllers HTTP, ORMs, clientes REST, filas. Implementam os ports.

## 2. Regras de dependência (o que o agente DEVE garantir)

- Dependências apontam **para dentro**: ORM/framework ficam restritos aos adapters; `@InjectRepository` ou `prisma.x.findMany()` dentro de use case → refatore extraindo um port.
- Domínio e use cases não conhecem HTTP nem contratos JSON de terceiros — isole-os atrás de um outbound port.
- O negócio define a interface; a infraestrutura implementa. Trocar o framework web não pode tocar o domínio.
- **Ports coesos, não explosão de ports** — agrupe operações relacionadas numa interface com nome de domínio; um port por método é overdesign.

## 3. Dose certa (anti-overengineering)

Arquitetura se aplica em escada, não em tudo-ou-nada:

| Projeto | Dose mínima |
|---|---|
| Script, site simples, CRUD fino | Separe **função pura** de I/O; nada de 4 camadas |
| Serviço com alguma regra de negócio | Ports para **persistência e APIs externas**; use cases onde há regra |
| Sistema longevo com domínio rico | Hexágono completo + pastas por feature |

Subir de degrau é refactor barato quando as funções já são puras; descer é caro. Em `Rigor do projeto: essential`, não imponha o hexágono completo a um CRUD.

Decisão estrutural cara de reverter (banco, mensageria, fronteira de serviço, exceção a padrão do playbook) é registrada em **ADR** no repo do projeto — template e regras no pack [adr.md](references/adr.md).

## 4. Testes

A arquitetura existe para isso: domínio testado com objetos reais e verificação de estado; adapters com dublês dos ports (skill `tdd`). Dificuldade de testar = camada vazando.

## Não faça

- ❌ ORM/HTTP no use case "só dessa vez" → ✅ port, sempre — a exceção vira o padrão
- ❌ Hexágono completo num CRUD fino → ✅ escada da dose certa (§3)
- ❌ Um port por método (`SaveUserPort`, `FindUserPort`) → ✅ interface coesa de domínio (`UserRepository`)
- ❌ Entidade anêmica espelhando a tabela, regra espalhada em services → ✅ regra de negócio dentro da entidade/VO
- ❌ Contrato JSON de terceiro circulando pelo domínio → ✅ traduza no adapter para tipo do domínio

## Quando ler o quê

- [clean-architecture.md](references/clean-architecture.md) — árvore de pastas por feature (bounded contexts), anti-padrão vs. padrão-ouro. Leia antes de criar a estrutura de um serviço ou módulo novo.
- [domain-entity.ts](references/domain-entity.ts) — blueprint de entidade de domínio pura. Consulte ao criar entidades.
- [adr.md](references/adr.md) — quando uma decisão exige ADR, regras e template canônico. Leia ao registrar ou revisar uma decisão arquitetural.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para projetos `Rigor do projeto: strict`.
