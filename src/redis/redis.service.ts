import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { configUtil } from 'src/common/utils/config.util';

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super({
      host: configUtil().getRedis<string>('host'),
      port: configUtil().getRedis<number>('port'),
    });
  }
}
