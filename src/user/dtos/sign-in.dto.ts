import { Expose } from 'class-transformer';

export class SignInDto {
  private readonly email: string;
  private readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @Expose()
  get getEmail(): string {
    return this.email;
  }

  @Expose()
  get getPassword(): string {
    return this.password;
  }
}
