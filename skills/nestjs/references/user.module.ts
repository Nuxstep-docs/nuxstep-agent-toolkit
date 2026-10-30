import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/http/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { PostgresUserRepository } from './infrastructure/database/postgres-user.repository';

@Module({
  imports: [], // Sem dependências externas de outros módulos se possível
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      // Inversão de dependência (Port)
      provide: 'USER_REPOSITORY',
      useClass: PostgresUserRepository,
    },
  ],
  exports: ['USER_REPOSITORY'],
})
export class UserModule {}
