import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;
  constructor(private readonly configService: ConfigService) {
    this.getRedisConfig();
  }

  getRedisConfig() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  getRedisClient(): Redis {
    return this.client;
  }
}
