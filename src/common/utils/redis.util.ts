import Redis from 'ioredis';
import { getConfig } from './global-config.util';

const redisInit = new Redis({
  host: getConfig<string>('REDIS_HOST'),
  port: getConfig<number>('REDIS_PORT'),
});

export const redisSetExpire = async (
  key: string,
  value: string,
  time: number,
) => {
  try {
    await redisInit.set(key, value, 'EX', time);
  } catch (err) {
    throw err;
  }
};

export const redisGetExpire = async (key: string) => {
  try {
    return await redisInit.get(key);
  } catch (err) {
    throw err;
  }
};

export const redisDelExpire = async (key: string) => {
  try {
    await redisInit.del(key);
  } catch (err) {
    throw err;
  }
};
