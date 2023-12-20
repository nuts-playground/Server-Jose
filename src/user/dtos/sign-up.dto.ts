import { ApiProperty } from '@nestjs/swagger';
import { SignUpResponseInterface } from '../interface/sign-up.interface';

export class SignUpDto {
  private readonly email: string;
  private readonly password: string;
  private readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  @ApiProperty()
  getEmail(): string {
    return this.email;
  }

  @ApiProperty()
  getName(): string {
    return this.name;
  }

  @ApiProperty()
  getPassword(): string {
    return this.password;
  }

  @ApiProperty()
  getSignUpInfo() {
    return {
      email: this.email,
      name: this.name,
    };
  }

  @ApiProperty()
  responseUserInfo(): SignUpResponseInterface {
    return {
      email: this.email,
      name: this.name,
    };
  }
}
