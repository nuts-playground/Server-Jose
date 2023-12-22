import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckVerificationCodeDto {
  private readonly email: string;
  private readonly verificationCode: string;

  constructor(email: string, verificationCode: string) {
    this.email = email;
    this.verificationCode = verificationCode;
  }

  @ApiProperty()
  @Expose()
  getEmail(): string {
    return this.email;
  }

  @ApiProperty()
  @Expose()
  getVerificationCode(): string {
    return this.verificationCode;
  }
}
