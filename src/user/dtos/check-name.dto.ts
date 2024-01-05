import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNameAlreadyExist } from '../decorator/user.decorator';

export class CheckNameDto {
  @IsNameAlreadyExist()
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
