import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SetVerificationCodeExpire } from '../interface/user-redis.interface';
import { AppGlobal } from 'src/global/app.global';

@Injectable()
export class UserRedisService {
  constructor() {}

  async setVerificationCode(setRedisInfo: SetVerificationCodeExpire) {
    try {
      const { key, value, time } = setRedisInfo;

      await AppGlobal.redis.set(key, value, 'EX', time);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }

  async getVerificationCode(key: string) {
    try {
      return await AppGlobal.redis.get(key);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }

  async deleteVerificationCode(key: string) {
    try {
      await AppGlobal.redis.del(key);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }
}
