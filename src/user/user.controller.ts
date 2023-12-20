import { Controller, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import {
  ValidateSignIn,
  ValidateSignUp,
} from 'src/user/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @Post('/sign-up')
  async signUp(@ValidateSignUp() dto: SignUpDto): Promise<any> {
    return await this.userService.signUp(dto);
  }

  @Post('/sign-in')
  async signIn(@ValidateSignIn() dto: SignInDto): Promise<any> {
    return await this.userService.signIn(dto);
  }

  @Patch()
  async patch() {
    return await this.userService.patch();
  }

  @Get('/')
  async test() {
    const redisClient = this.redisService.getRedisClient();
    await redisClient.set('test', 'zz');
    const rs = await redisClient.get('test');
    console.log(rs);
  }
}
