import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  private readonly email: string;

  @IsNotEmpty()
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
