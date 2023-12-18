import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}
  @Get('/')
  async test() {
    const redisClient = this.redisService.getRedisClient();
    await redisClient.set('test', 'zz');
    const rs = await redisClient.get('test');
    console.log(rs);
  }
}
