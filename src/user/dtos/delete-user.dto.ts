import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DeleteUserDto {
  private readonly email: string;

  constructor(email: string) {
    this.email = email;
  }

  @ApiProperty({ name: 'email', default: '' })
  @Expose()
  getEmail(): string {
    return this.email;
  }
}
