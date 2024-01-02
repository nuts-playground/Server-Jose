import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserServiceUtil } from 'src/user/utils/user.service.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: false,
    }),
  ],
  providers: [
    AuthService,
    UserServiceUtil,
    PrismaService,
    RedisService,
    ConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
