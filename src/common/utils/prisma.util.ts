import { PrismaClient } from '@prisma/client';
import {
  PrismaResponseUserInterface,
  PrismaSaveUserInterface,
} from './interfaces/prisma/prisma-util.interface';

export const prisma = new PrismaClient();

export const prismaOnModuleInit = async () => {
  await prisma.$connect();
};

export const findById = async (
  id: string,
): Promise<PrismaResponseUserInterface> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const findByEmail = async (
  email: string,
): Promise<PrismaResponseUserInterface> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const findByName = async (
  name: string,
): Promise<PrismaResponseUserInterface> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const saveUser = async (
  dto: PrismaSaveUserInterface,
): Promise<PrismaResponseUserInterface> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        id: dto.id,
        email: dto.email,
        name: dto.name,
        password: dto.password,
        about_me: dto.about_me,
        profile_image_url: dto.profile_image_url,
        created_at: dto.created_at,
        updated_at: dto.updated_at,
        delete_yn: dto.delete_yn,
      },
    });

    return newUser;
  } catch (err) {
    throw err;
  }
};
