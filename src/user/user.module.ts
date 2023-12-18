import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UserService, RedisService, ConfigService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
