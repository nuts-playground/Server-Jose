import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppGlobal } from 'src/global/app.global';
import { AuthRedisSetToken } from '../interface/auth.redis.interface';

@Injectable()
export class AuthRedisService {
  constructor() {}

  async setRefreshToken(redisInfo: AuthRedisSetToken) {
    try {
      const { id, token, time } = redisInfo;
      await AppGlobal.redis.set(id, token, 'EX', time);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }
}
