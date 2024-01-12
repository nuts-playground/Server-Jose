import { PrismaClient } from '@prisma/client';
import { PrismaUser } from './interfaces/prisma.util.interface';
import { InternalServerErrorException } from '@nestjs/common';

export const prisma = new PrismaClient();

export const prismaUtil = () => {
  return {
    onModuleInit: async () => {
      await prisma.$connect();
    },
    findById: async (id: number): Promise<PrismaUser> => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            id,
          },
        });

        return user;
      } catch (err) {
        throw new InternalServerErrorException();
      }
    },
    findByEmail: async (email: string): Promise<PrismaUser> => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            email,
          },
        });

        return user;
      } catch (err) {
        throw new InternalServerErrorException();
      }
    },
    findByName: async (nick_name: string): Promise<PrismaUser> => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            nick_name,
          },
        });

        return user;
      } catch (err) {
        throw new InternalServerErrorException();
      }
    },
    saveUser: async (userInfo: PrismaUser): Promise<PrismaUser> => {
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
        throw new InternalServerErrorException();
      }
    },
  };
};
