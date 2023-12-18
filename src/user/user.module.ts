import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UserService, RedisService, ConfigService],
  controllers: [UserController],
})
export class UserModule {}
