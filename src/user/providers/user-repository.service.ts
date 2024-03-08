import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RepositoryUserResponse,
  SignUpUser,
  UpdateUser,
} from '../interface/repository.interface';

@Injectable()
export class UserRepositoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<RepositoryUserResponse> {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<RepositoryUserResponse> {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async findByName(nick_name: string): Promise<RepositoryUserResponse> {
    return this.prisma.users.findUnique({
      where: {
        nick_name,
      },
    });
  }

  async saveUser(userInfo: SignUpUser): Promise<RepositoryUserResponse> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: userInfo,
      });

      if (userInfo.profile_image_url) {
        await tx.users_files.create({
          data: {
            user_id: user.id,
            img_file_url: userInfo.profile_image_url,
          },
        });
      }

      return user;
    });
  }

  async updateUser(userInfo: UpdateUser): Promise<RepositoryUserResponse> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.update({
        where: {
          email: userInfo.email,
        },
        data: userInfo,
      });

      return user;
    });
  }

  async deleteUser(email: string): Promise<RepositoryUserResponse> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: {
          email,
        },
      });

      await tx.users_files.update({
        where: {
          user_id: user.id,
        },
        data: {
          delete_yn: 'Y',
        },
      });

      const responseUser = await tx.users.update({
        where: {
          id: user.id,
        },
        data: {
          delete_yn: 'Y',
        },
      });

      return responseUser;
    });
  }
}
