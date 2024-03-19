import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppGlobal } from 'src/global/app.global';
import {
  UserRedisDeleteToken,
  UserRedisDeleteVerificationCode,
  UserRedisGetVerificationCode,
  UserRedisSetVerificationCode,
} from '../interface/user.redis.interface';

@Injectable()
export class UserRedisService {
  constructor() {}

  async setVerificationCode(userInfo: UserRedisSetVerificationCode) {
    try {
      const { email, verificationCode, time } = userInfo;

      await AppGlobal.redis.set(email, verificationCode, 'EX', time);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }

  async getVerificationCode(userInfo: UserRedisGetVerificationCode) {
    try {
      const { email } = userInfo;

      return await AppGlobal.redis.get(email);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }

  async deleteVerificationCode(userInfo: UserRedisDeleteVerificationCode) {
    try {
      const { email } = userInfo;

      await AppGlobal.redis.del(email);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }

  async deleteToken(userInfo: UserRedisDeleteToken) {
    try {
      const { id } = userInfo;

      await AppGlobal.redis.del(id);
    } catch (error) {
      throw new InternalServerErrorException('잠시 후 다시 시도해 주세요.');
    }
  }
}
