export class UserEntity {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date
  ) {}

  public static create(email: string, name: string): UserEntity {
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }
    // Entidade PURA. Não há banco de dados aqui.
    return new UserEntity('ulid-placeholder', email, name, new Date());
  }
}
