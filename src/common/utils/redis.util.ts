import Redis from 'ioredis';
import { getConfig } from '../config/global-config.util';

const redis = new Redis({
  host: getConfig<string>('REDIS_HOST'),
  port: getConfig<number>('REDIS_PORT'),
});

export const redisSetExpire = async (
  key: string,
  value: string,
  time: number,
) => {
  try {
    await redis.set(key, value, 'EX', time);
  } catch (err) {
    throw err;
  }
};

export const redisGetExpire = async (key: string) => {
  try {
    return await redis.get(key);
  } catch (err) {
    throw err;
  }
};

export const redisDelExpire = async (key: string) => {
  try {
    await redis.del(key);
  } catch (err) {
    throw err;
  }
};
