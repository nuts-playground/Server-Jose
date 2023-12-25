import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckPasswordDto {
  private readonly password: string;

  constructor(password: string) {
    this.password = password;
  }

  @ApiProperty()
  @Expose()
  getPassword(): string {
    return this.password;
  }
}
