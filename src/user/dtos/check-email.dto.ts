import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmailAlreadyExist } from '../decorator/user.decorator';

export class UserCheckEmailDto {
  @IsEmailAlreadyExist()
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
