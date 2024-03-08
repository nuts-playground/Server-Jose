import { Module } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepositoryService } from './providers/user-repository.service';
import { RedisModule } from 'src/redis/redis.module';
import { UserRedisService } from './providers/user-redis.service';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [UserService, UserRepositoryService, UserRedisService],
  controllers: [UserController],
})
export class UserModule {}
