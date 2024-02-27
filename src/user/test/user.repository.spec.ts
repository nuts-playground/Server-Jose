import { commonPrismaUtil, prisma } from 'src/common/utils/prisma.util';
import { userPrismaUtil } from '../utils/prisma.util';
import { UserPrisma } from '../interface/prisma.util';

const loop: number[] = new Array(3).fill(0).map((_, index) => {
  return index;
});

const users: UserPrisma[] = [];

// 테스트용 유저 생성
beforeAll(async () => {
  await commonPrismaUtil().onModuleInit();

  for (const user of loop) {
    const newUser: UserPrisma = await userPrismaUtil().saveUser({
      email: `hello${user}`,
      nick_name: `hello${user}`,
    });

    users.push(newUser);
  }
});

describe('Prisma 연동 테스트', () => {
  it('Prisma Connect 테스트', async () => {
    try {
      await commonPrismaUtil().onModuleInit();
    } catch (error) {
      expect(error).toThrow(error);
    }
  });

  it('Prisma Disconnet 테스트', async () => {
    try {
      await commonPrismaUtil().onModuleDestroy();
    } catch (error) {
      expect(error).toThrow(error);
    }
  });
});

describe('User Prisma Test', () => {
  it('Find Unique Test', async () => {});
});

// cascade 적용 후 다시 진행해 보자
afterAll(async () => {
  for (const user of users) {
    const deleteUser = await userPrismaUtil().deleteUser(user.id);
    console.log(deleteUser);
  }
  await prisma.users.deleteMany();
});
