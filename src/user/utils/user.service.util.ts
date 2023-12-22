import { PrismaService } from 'src/prisma/prisma.service';
import {
  SignUpServiceResponseInterface,
  SignUpInterface,
} from '../interface/sign-up.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserServiceUtil {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<SignUpServiceResponseInterface> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async saveUser(
    dto: SignUpInterface,
  ): Promise<SignUpServiceResponseInterface> {
    try {
      const newUser = await this.prisma.user.create({
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
  }
}
