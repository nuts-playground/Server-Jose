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

  async setExpire(key: string, value: string, time: number) {
    await this.client.set(key, value, 'EX', time);
  }

  async getExpire(key: string) {
    return await this.client.get(key);
  }

  async delExpire(key: string) {
    await this.client.del(key);
  }
}
