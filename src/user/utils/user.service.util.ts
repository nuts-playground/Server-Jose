import { PrismaService } from 'src/prisma/prisma.service';

export class UserServiceUtil {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async saveUser(name: string, password: string, email: string) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          id: '4',
          email: email,
          name: name,
          password: password,
          signup_verify_token: 'test',
        },
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
