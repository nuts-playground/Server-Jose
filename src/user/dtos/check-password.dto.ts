import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsPassword } from '../decorator/user.decorator';

export class UserCheckPasswordDto {
  @IsPassword()
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
