import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppGlobal } from 'src/global/app.global';
import {
  UserRepositoryResponse,
  UserRepositoryUpdate,
} from 'src/user/interface/user.repository.interface';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';

describe('UserRepositoryService', () => {
  let userRepository: UserRepositoryService;
  let prisma: PrismaClient;
  let testUser: UserRepositoryResponse;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepositoryService],
    }).compile();

    prisma = AppGlobal.prisma;
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
      const user: UserRepositoryResponse = await userRepository.findById({
        id: testUser.id,
      });
      expect(user).toStrictEqual(testUser);
    });

    it('아이디가 없을 때', async () => {
      const user: UserRepositoryResponse = await userRepository.findById({
        id: 0,
      });

      expect(user).toBeNull();
    });
  });

  describe('findByEmail [이메일로 계정 찾기]', () => {
    it('이메일이 있을 때', async () => {
      const user: UserRepositoryResponse = await userRepository.findByEmail({
        email: testUser.email,
      });
      expect(user).toStrictEqual(testUser);
    });

    it('이메일이 없을 때', async () => {
      const user: UserRepositoryResponse = await userRepository.findByEmail({
        email: 'failEamil',
      });
      expect(user).toBeNull();
    });
  });

  describe('findByName [닉네임으로 계정 찾기]', () => {
    it('닉네임이 있을 때', async () => {
      const user: UserRepositoryResponse = await userRepository.findByName({
        nick_name: testUser.nick_name,
      });
      expect(user).toStrictEqual(testUser);
    });

    it('닉네임이 없을 때', async () => {
      const user: UserRepositoryResponse = await userRepository.findByName({
        nick_name: 'failNickName',
      });
      expect(user).toBeNull();
    });
  });

  describe('updateUser [계정 정보 수정]', () => {
    it('정상적으로 수정할 때', async () => {
      const updateData: UserRepositoryUpdate = {
        id: testUser.id,
        nick_name: 'updateNickName',
      };

      const user: UserRepositoryResponse = await userRepository.updateUser(
        updateData,
      );

      expect(user.nick_name).toStrictEqual(updateData.nick_name);
    });

    it('수정할 계정이 없을 때', async () => {
      const updateData: UserRepositoryUpdate = {
        id: 0,
        nick_name: 'updateNickName',
      };

      const user: UserRepositoryResponse = await userRepository.updateUser(
        updateData,
      );

      expect(user).toBeNull();
    });
  });

  describe('deleteUser [계정 삭제]', () => {
    it('정상적으로 삭제할 때', async () => {
      const user: UserRepositoryResponse = await userRepository.deleteUser({
        id: testUser.id,
      });

      expect(user.delete_yn).toStrictEqual('Y');
    });

    it('삭제할 계정이 없을 때', async () => {
      const user: UserRepositoryResponse = await userRepository.deleteUser({
        id: 0,
      });

      expect(user).toBeNull();
    });
  });

  afterAll(async () => {
    AppGlobal.redis.disconnect();
    await prisma.users.delete({ where: { id: testUser.id } });
  });
});
