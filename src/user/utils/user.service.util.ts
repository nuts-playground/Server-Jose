import {
  SignUpServiceResponseInterface,
  SignUpInterface,
} from '../interface/sign-up.interface';
import { prisma } from 'src/common/utils/prisma.util';

export const findByEmail = async (
  email: string,
): Promise<SignUpServiceResponseInterface> => {
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
): Promise<SignUpServiceResponseInterface> => {
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
  dto: SignUpInterface,
): Promise<SignUpServiceResponseInterface> => {
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
