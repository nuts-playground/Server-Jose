import { Module } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepositoryService } from './providers/user-repository.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserRepositoryService],
  controllers: [UserController],
})
export class UserModule {}
