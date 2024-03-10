import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { SetVerificationCodeExpire } from '../interface/user-redis.interface';

@Injectable()
export class UserRedisService {
  constructor(private readonly redisService: RedisService) {}

  async setVerificationCode(setRedisInfo: SetVerificationCodeExpire) {
    try {
      const { key, value, time } = setRedisInfo;

      await this.redisService.set(key, value, 'EX', time);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }

  async getVerificationCode(key: string) {
    try {
      return await this.redisService.get(key);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }

  async deleteVerificationCode(key: string) {
    try {
      await this.redisService.del(key);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }
}
