import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  private readonly email: string;

  @IsNotEmpty()
  private readonly password: string;

  @IsNotEmpty()
  private readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  @Expose()
  get getEmail(): string {
    return this.email;
  }

  @Expose()
  get getName(): string {
    return this.name;
  }

  @Expose()
  get getPassword(): string {
    return this.password;
  }
}
