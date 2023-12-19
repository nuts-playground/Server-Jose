import { ApiProperty } from '@nestjs/swagger';

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
}
