import { Module } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepositoryService } from './providers/user-repository.service';
import { UserRedisService } from './providers/user-redis.service';

@Module({
  providers: [UserService, UserRepositoryService, UserRedisService],
  controllers: [UserController],
})
export class UserModule {}
