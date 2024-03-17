import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNameAlreadyExist } from '../decorator/user.decorator';

export class UserCheckNameDto {
  @IsNameAlreadyExist()
  private readonly nick_name: string;

  constructor(nick_name: string) {
    this.nick_name = nick_name;
  }

  @ApiProperty()
  @Expose()
  getNickName(): string {
    return this.nick_name;
  }
}
