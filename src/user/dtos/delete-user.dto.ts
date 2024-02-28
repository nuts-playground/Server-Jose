import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  private readonly email: string;

  constructor(email: string) {
    this.email = email;
  }

  @ApiProperty({ name: 'email', default: '' })
  getEmail(): string {
    return this.email;
  }
}
