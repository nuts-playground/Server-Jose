import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { AppGlobal } from 'src/global/app.global';
import { UserRedisSetVerificationCode } from 'src/user/interface/user.redis.interface';
import { UserRedisService } from 'src/user/providers/user-redis.service';

describe('UserRedisServcie', () => {
  let userRedisService: UserRedisService;
  let redis: Redis;
  let testUser: UserRedisSetVerificationCode;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRedisService],
    }).compile();

    userRedisService = module.get<UserRedisService>(UserRedisService);
    redis = AppGlobal.redis;
    testUser = {
      email: 'test_user@example.com',
      verificationCode: '123456',
      time: 60,
    };
  });

  describe('setVerificationCode [인증 코드 저장]', () => {
    it('정상적으로 저장될 때', async () => {
      await userRedisService.setVerificationCode(testUser);
      const verificationCode = await redis.get(testUser.email);

      expect(verificationCode).toStrictEqual(testUser.verificationCode);

      await redis.del(testUser.email);
    });
  });

  describe('getVerificationCode [인증 코드 가져오기]', () => {
    it('정상적으로 가져올 때', async () => {
      await redis.set(
        testUser.email,
        testUser.verificationCode,
        'EX',
        testUser.time,
      );
      const verificationCode = await userRedisService.getVerificationCode({
        email: testUser.email,
      });

      expect(verificationCode).toStrictEqual(testUser.verificationCode);

      await redis.del(testUser.email);
    });
  });

  describe('deleteVerificationCode [인증 코드 삭제]', () => {
    it('정상적으로 삭제할 때', async () => {
      await redis.set(
        testUser.email,
        testUser.verificationCode,
        'EX',
        testUser.time,
      );
      await userRedisService.deleteVerificationCode({ email: testUser.email });
      const verificationCode = await redis.get(testUser.email);

      expect(verificationCode).toBeNull();
    });
  });

  afterAll(() => {
    redis.disconnect();
  });
});
