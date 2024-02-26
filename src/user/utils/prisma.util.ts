import { prisma } from 'src/common/utils/prisma.util';

import { InternalServerErrorException } from '@nestjs/common';
import { UserPrismaUtil, UserPrisma } from '../interface/prisma.util';

export const userPrismaUtil = (): UserPrismaUtil => {
  return {
    findById: async (id: number): Promise<UserPrisma> => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            id,
          },
        });

        return user;
      } catch (err) {
        console.log(err);

        throw new InternalServerErrorException();
      }
    },
    findByEmail: async (email: string): Promise<UserPrisma> => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            email,
          },
        });

        return user;
      } catch (err) {
        console.log(err);

        throw new InternalServerErrorException();
      }
    },
    findByName: async (nick_name: string): Promise<UserPrisma> => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            nick_name,
          },
        });

        return user;
      } catch (err) {
        console.log(err);

        throw new InternalServerErrorException();
      }
    },
    saveUser: async (userInfo: UserPrisma): Promise<UserPrisma> => {
      try {
        const user = await prisma.users.create({
          data: {
            email: userInfo.email,
            nick_name: userInfo.nick_name,
            password: userInfo.password,
            about_me: userInfo.about_me,
            provider: userInfo.provider,
            profile_image_url: userInfo.profile_image_url,
            created_at: userInfo.created_at,
            updated_at: userInfo.updated_at,
            delete_yn: userInfo.delete_yn,
          },
        });

        return user;
      } catch (err) {
        console.log(err);

        throw new InternalServerErrorException();
      }
    },
  };
};
