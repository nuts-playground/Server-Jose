import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SetRefreshToken } from '../interface/auth-redis.interface';
import { AppGlobal } from 'src/app.global';

@Injectable()
export class AuthRedisService {
  constructor() {}

  async setRefreshToken(redisInfo: SetRefreshToken) {
    try {
      const { key, value, time } = redisInfo;
      await AppGlobal.redis.set(key, value, 'EX', time);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }
}
