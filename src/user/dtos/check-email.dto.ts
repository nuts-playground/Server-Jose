import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckEmailDto {
  private readonly email: string;
  private readonly authToken: string;

  constructor(email: string, authToken: string) {
    this.email = email;
    this.authToken = authToken;
  }

  @ApiProperty()
  @Expose()
  getEmail(): string {
    return this.email;
  }

  @ApiProperty()
  @Expose()
  getAuthToken(): string {
    return this.authToken;
  }
}
