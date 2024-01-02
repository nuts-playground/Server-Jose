import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  private readonly email: string;
  private readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @ApiProperty()
  getEmail() {
    return this.email;
  }

  @ApiProperty()
  getPassword() {
    return this.password;
  }
}
