import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckNameDto {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  @ApiProperty()
  @Expose()
  getName(): string {
    return this.name;
  }
}
