import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RepositoryUserInfo } from '../interface/repository.interface';
import { configUtil } from 'src/common/utils/config.util';
import { uuidUtil } from 'src/common/utils/uuid.util';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UpdateUser } from '../interface/update-user.interface';

@Injectable()
export class UserRepositoryService {
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
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: userInfo,
      });

      if (userInfo.profile_image_url) {
        const imgFileUrl = `${configUtil().getImgFileUrl(
          'url',
        )}/${uuidUtil().v4()}`;

        await tx.users_files.create({
          data: {
            user_id: user.id,
            img_file_url: imgFileUrl,
          },
        });
      }

      return user;
    });
  }

  async updateUser(userInfo: UpdateUser): Promise<void> {
    this.prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: {
          email: userInfo.email,
        },
        data: userInfo,
      });

      // if (userInfo.profile_image_url) {
      //   const imgFileUrl = `${configUtil().getImgFileUrl(
      //     'url',
      //   )}/${uuidUtil().v4()}`;

      //   await tx.users_files.create({
      //     data: {
      //       user_id: userInfo.id,
      //       img_file_url: imgFileUrl,
      //     },
      //   });
      // }
    });
  }

  async deleteUser(email: string): Promise<void> {
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

      await tx.users.update({
        where: {
          id: user.id,
        },
        data: {
          delete_yn: 'Y',
        },
      });
    });
  }
}
