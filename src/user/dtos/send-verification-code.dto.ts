import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SendVerificationCodeDto {
  private readonly email: string;

  constructor(email: string) {
    this.email = email;
  }

  @ApiProperty()
  @Expose()
  getEmail(): string {
    return this.email;
  }
}
