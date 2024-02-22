import { Redis } from 'ioredis';
import { configUtil } from './config.util';
import { RedisSetExpire } from './interfaces/redis.util.interface';
import { InternalServerErrorException } from '@nestjs/common';

export const redis = new Redis({
  host: configUtil().getRedis<string>('host'),
  port: configUtil().getRedis<number>('port'),
});

export const redisUtil = () => {
  return {
    setExpire: async (redisInfo: RedisSetExpire) => {
      try {
        const { key, value, time } = redisInfo;
        await redis.set(key, value, 'EX', time);
      } catch (err) {
        throw new InternalServerErrorException();
      }
    },
    getExpire: async (key: string): Promise<string> => {
      try {
        return await redis.get(key);
      } catch (err) {
        throw new InternalServerErrorException();
      }
    },
    delExpire: async (key: string) => {
      try {
        await redis.del(key);
      } catch (err) {
        throw new InternalServerErrorException();
      }
    },
  };
};
