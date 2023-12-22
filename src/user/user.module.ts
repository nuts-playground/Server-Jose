import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserServiceUtil } from './utils/user.service.util';

@Module({
  providers: [
    UserService,
    UserServiceUtil,
    RedisService,
    ConfigService,
    PrismaService,
  ],
  controllers: [UserController],
})
export class UserModule {}
