# Playbook: Clean Architecture na Prática

Ao desenhar a árvore de diretórios de um novo microsserviço ou módulo, a regra de ouro é **Separar por Features (Bounded Contexts) e não por tipos técnicos**.

### Anti-Padrão (NÃO USE)
```text
src/
  controllers/
    UserController.ts
    ProductController.ts
  services/
    UserService.ts
    ProductService.ts
  models/
    User.ts
    Product.ts
```

### Padrão Ouro (USE ESTE)
```text
src/
  modules/
    users/
      domain/
        UserEntity.ts
      application/
        use-cases/
          CreateUserUseCase.ts
        ports/
          UserRepository.ts
      infrastructure/
        http/
          UserController.ts
        database/
          PostgresUserRepository.ts
```
