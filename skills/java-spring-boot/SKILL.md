---
name: java-spring-boot
description: >-
  Padrões corporativos da Nuxstep para serviços em Java moderno com Spring
  Boot: domínio livre de Spring/JPA, injeção via construtor, erros em RFC
  7807 (ProblemDetail), validação de borda, virtual threads e testes com
  JUnit 5/ArchUnit/Testcontainers. Use sempre que criar ou alterar código
  Java/Spring — endpoints, services, entidades, repositórios, testes — também
  em pedidos implícitos como "crie um CRUD", "adicione um endpoint" ou "essa
  exception está vazando" em projetos Java.
license: Proprietary
metadata:
  globs: "**/*.java,**/pom.xml,**/build.gradle*"
  category: backend
  visibility: "public"
---

# Java & Spring Boot

Padrões para Java moderno + Spring Boot (versões vigentes: tool MCP `get_approved_stack`; Boot 4/Framework 7 é a linha atual). Arquitetura: skill `software-architecture` (hexagonal).

1. **Domínio sem Spring nem JPA** — POJOs e records puros: sem `@Component`, sem `@Entity` no domínio. O mapeamento domínio ↔ JPA acontece no adapter (MapStruct/funções).
2. **Camadas no Spring** — Use cases como beans de configuração explícita; `@RestController`, `@Entity`, `@Repository` e DTOs HTTP vivem na infra. Controller nunca acessa repository direto.
3. **Injeção via construtor** — nunca `@Autowired` em campo; `final` + construtor (Lombok `@RequiredArgsConstructor` ok). Dependência explícita é testabilidade.
4. **Erros em RFC 7807** — `@RestControllerAdvice` traduz exceções de domínio para `ProblemDetail`; domínio lança exceções próprias, nunca `ResponseStatusException` de dentro do negócio.
5. **Validação de borda** — Jakarta Bean Validation (`@Valid`, `@NotNull`...) nos DTOs de entrada; records para DTOs imutáveis.
6. **Null-safety declarada** — JSpecify (`@NullMarked` por pacote) na linha Boot 4/Framework 7; `Optional` para retorno "pode não existir", nunca para campo/parâmetro.
7. **Virtual threads para I/O-bound** — habilite (`spring.threads.virtual.enabled=true`) em serviços de I/O; não use pool manual para o que virtual thread resolve.
8. **Config tipada** — `@ConfigurationProperties` + validação na subida; sem `@Value` espalhado.
9. **Resiliência HTTP externa** — `RestClient` com timeout + retry/circuit (Resilience4j) em toda chamada a terceiros.

## Testes (TDD)

JUnit 5 + AssertJ: use case **puro** com fakes dos ports (sem subir contexto Spring em unidade); `@SpringBootTest` para wiring/e2e com **Testcontainers** (banco real); **ArchUnit** garante as camadas. Método: skill `tdd`; regra obrigatória em [testing-archunit.md](references/testing-archunit.md).

## Não faça

- ❌ `@Autowired` em campo → ✅ construtor com `final`
- ❌ `@Entity` do JPA circulando como modelo de domínio → ✅ mapper no adapter
- ❌ `@Transactional` no controller ou no domínio → ✅ fronteira transacional no use case/service de aplicação
- ❌ Capturar `Exception` genérica e devolver 500 mudo → ✅ exceção de domínio + ProblemDetail no advice
- ❌ Subir `@SpringBootTest` para testar regra de negócio → ✅ use case puro com fakes (suíte 100x mais rápida)

## Quando ler o quê

- [testing-archunit.md](references/testing-archunit.md) — suíte de testes de arquitetura com a regra obrigatória de isolamento do domínio. Leia ao criar/revisar testes de arquitetura.
- [ControllerServiceExample.java](references/ControllerServiceExample.java) — blueprint de controller + service. Consulte ao criar endpoints.
- [strict-mode.md](references/strict-mode.md) — regras adicionais para `Rigor do projeto: strict`.
