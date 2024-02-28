import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RepositoryUserInfo } from '../interface/repository.interface';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<RepositoryUserInfo> {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<RepositoryUserInfo> {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async findByName(nick_name: string): Promise<RepositoryUserInfo> {
    return this.prisma.users.findUnique({
      where: {
        nick_name,
      },
    });
  }

  async saveUser(userInfo: RepositoryUserInfo): Promise<RepositoryUserInfo> {
    return await this.prisma.users.create({
      data: userInfo,
    });
  }
}
