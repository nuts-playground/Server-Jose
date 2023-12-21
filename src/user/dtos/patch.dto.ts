import { Expose } from 'class-transformer';

export class PatchDto {
  private readonly email: string;
  private readonly password: string;
  private readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  @Expose()
  getEmail(): string {
    return this.email;
  }

  @Expose()
  getPassword(): string {
    return this.password;
  }

  @Expose()
  getName(): string {
    return this.name;
  }
}
