import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckNameDto {
  private readonly name: string;
  private readonly authToken: string;

  constructor(name: string, authToken: string) {
    this.name = name;
    this.authToken = authToken;
  }

  @ApiProperty()
  @Expose()
  getName(): string {
    return this.name;
  }

  @ApiProperty()
  @Expose()
  getAuthToken(): string {
    return this.authToken;
  }
}
