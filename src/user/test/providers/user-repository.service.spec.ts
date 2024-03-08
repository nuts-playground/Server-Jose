import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RepositoryUserResponse,
  UpdateUser,
} from 'src/user/interface/repository.interface';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';

describe('UserRepositoryService', () => {
  let userRepository: UserRepositoryService;
  let prisma: PrismaService;
  let testUser: RepositoryUserResponse;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepositoryService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    userRepository = module.get<UserRepositoryService>(UserRepositoryService);

    testUser = await prisma.users.create({
      data: {
        email: 'hello@example.com',
        nick_name: 'TestUser',
        password: 'testPassword',
      },
    });
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('findById [아이디로 계정 찾기]', () => {
    it('아이디가 있을 때', async () => {
      const user: RepositoryUserResponse = await userRepository.findById(
        testUser.id,
      );
      expect(user).toStrictEqual(testUser);
    });

    it('아이디가 없을 때', async () => {
      const user: RepositoryUserResponse = await userRepository.findById(0);

      expect(user).toBeNull();
    });
  });

  describe('findByEmail [이메일로 계정 찾기]', () => {
    it('이메일이 있을 때', async () => {
      const user: RepositoryUserResponse = await userRepository.findByEmail(
        testUser.email,
      );
      expect(user).toStrictEqual(testUser);
    });

    it('이메일이 없을 때', async () => {
      const user: RepositoryUserResponse = await userRepository.findByEmail(
        'failEamil',
      );
      expect(user).toBeNull();
    });
  });

  describe('findByName [닉네임으로 계정 찾기]', () => {
    it('닉네임이 있을 때', async () => {
      const user: RepositoryUserResponse = await userRepository.findByName(
        testUser.nick_name,
      );
      expect(user).toStrictEqual(testUser);
    });

    it('닉네임이 없을 때', async () => {
      const user: RepositoryUserResponse = await userRepository.findByName(
        'failNickName',
      );
      expect(user).toBeNull();
    });
  });

  describe('updateUser [계정 정보 수정]', () => {
    it('정상적으로 수정할 때', async () => {
      const updateData: UpdateUser = {
        email: testUser.email,
        nick_name: 'updateNickName',
      };

      const user: RepositoryUserResponse = await userRepository.updateUser(
        updateData,
      );

      expect(user.nick_name).toStrictEqual(updateData.nick_name);
    });
  });

  describe('deleteUser [계정 삭제]', () => {
    it('정상적으로 삭제할 때', async () => {
      const user: RepositoryUserResponse = await userRepository.deleteUser(
        testUser.email,
      );

      expect(user.delete_yn).toStrictEqual('Y');
    });

    it('삭제할 계정이 없을 때', async () => {
      const user: RepositoryUserResponse = await userRepository.deleteUser(
        'failEmail',
      );

      expect(user).toBeNull();
    });
  });

  // afterAll(async () => {
  //   await prisma.users.delete({ where: { id: testUser.id } });
  // });
});
