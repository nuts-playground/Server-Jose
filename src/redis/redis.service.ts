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

  getClient(): Redis {
    return this.client;
  }

  async setExpire(key: string, value: string, time: number) {
    try {
      await this.client.set(key, value, 'EX', time);
    } catch (err) {
      throw err;
    }
  }

  async getExpire(key: string) {
    try {
      return await this.client.get(key);
    } catch (err) {
      throw err;
    }
  }

  async delExpire(key: string) {
    try {
      await this.client.del(key);
    } catch (err) {
      throw err;
    }
  }
}
