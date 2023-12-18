import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() dto: SignUpDto) {
    await this.userService.signUp(dto);
  }

  @Post('/sign-in')
  async signIn(@Body() dto: SignInDto) {
    await this.userService.signIn(dto);
  }

  @Get('/')
  async test() {
    const redisClient = this.redisService.getRedisClient();
    await redisClient.set('test', 'zz');
    const rs = await redisClient.get('test');
    console.log(rs);
  }
}
