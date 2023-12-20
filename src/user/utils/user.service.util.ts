import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInterface } from '../interface/sign-up.interface';

export class UserServiceUtil {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async saveUser(dto: SignUpInterface) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          id: dto.id,
          email: dto.email,
          name: dto.name,
          password: dto.password,
        },
      });

      return newUser;
    } catch (err) {
      throw err;
    }
  }
}
