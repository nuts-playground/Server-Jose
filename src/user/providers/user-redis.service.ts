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
      throw new InternalServerErrorException('인증번호 전송에 실패하였습니다.');
    }
  }

  async getVerificationCode(key: string) {
    try {
      return await this.redisService.get(key);
    } catch (error) {
      throw new InternalServerErrorException('get');
    }
  }

  async deleteVerificationCode(key: string) {
    try {
      await this.redisService.del(key);
    } catch (error) {
      throw new InternalServerErrorException('set');
    }
  }
}
