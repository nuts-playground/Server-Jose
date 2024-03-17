import { Injectable } from '@nestjs/common';
import {
  UserRepositoryFindByEmail,
  UserRepositoryFindById,
  UserRepositoryFindByNickName,
  UserRepositoryResponse,
  UserRepositorySignUp,
  UserRepositoryUpdate,
  UserRepositryDelete,
} from '../interface/user.repository.interface';
import { AppGlobal } from 'src/global/app.global';

@Injectable()
export class UserRepositoryService {
  constructor() {}

  async findById(
    userInfo: UserRepositoryFindById,
  ): Promise<UserRepositoryResponse> {
    const id = userInfo.id;

    return AppGlobal.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(
    userInfo: UserRepositoryFindByEmail,
  ): Promise<UserRepositoryResponse> {
    const email = userInfo.email;

    return AppGlobal.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async findByName(
    userInfo: UserRepositoryFindByNickName,
  ): Promise<UserRepositoryResponse> {
    const nick_name = userInfo.nick_name;

    return AppGlobal.prisma.users.findUnique({
      where: {
        nick_name,
      },
    });
  }

  async saveUser(
    userInfo: UserRepositorySignUp,
  ): Promise<UserRepositoryResponse> {
    return AppGlobal.prisma.$transaction(async (tx) => {
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

  async updateUser(
    userInfo: UserRepositoryUpdate,
  ): Promise<UserRepositoryResponse | null> {
    return AppGlobal.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: {
          id: userInfo.id,
        },
      });

      if (!user) return null;

      const responseUser = await tx.users.update({
        where: {
          id: userInfo.id,
        },
        data: userInfo,
      });

      return responseUser;
    });
  }

  async deleteUser(
    userInfo: UserRepositryDelete,
  ): Promise<UserRepositoryResponse | null> {
    const id = userInfo.id;

    return AppGlobal.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: {
          id,
        },
      });

      if (!user) return null;

      if (user.profile_image_url) {
        await tx.users_files.update({
          where: {
            user_id: user.id,
          },
          data: {
            delete_yn: 'Y',
          },
        });
      }

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
