# Playbook: Validação de Arquitetura com ArchUnit

Para garantir as regras da Arquitetura Hexagonal, todo projeto Spring Boot da Nuxstep deve ter uma suíte de testes de arquitetura usando [ArchUnit](https://www.archunit.org/).

### Exemplo de Regra Obrigatória

A camada de domínio nunca deve importar o framework Spring.

```java
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "com.acme.myapp")
public class ArchitectureRulesTest {

    @ArchTest
    static final ArchRule domain_should_not_depend_on_spring =
        noClasses().that().resideInAPackage("..domain..")
        .should().dependOnClassesThat().resideInAPackage("org.springframework..");
}
```
