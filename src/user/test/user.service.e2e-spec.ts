import {
  HttpServer,
  INestApplication,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/user/user.module';
import * as request from 'supertest';
import * as nodemailer from 'nodemailer';
import { AuthModule } from 'src/auth/auth.module';
import { UserRedisService } from 'src/user/providers/user-redis.service';
import { AppGlobal } from 'src/global/app.global';
import { PrismaClient } from '@prisma/client';
import { globalBcryptUtil } from 'src/common/utils/bcrypt.util';
import { UserRedisSetVerificationCode } from '../interface/user.redis.interface';

interface NewUser {
  email: string;
  nick_name: string;
  password: string;
  verificationCode: string;
}

interface testUser {
  email: string;
  nick_name: string;
  password: string;
  verificationCode?: string;
}

describe('UserService (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let userRedisService: UserRedisService;
  let testUser: testUser;
  let newUser: NewUser;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule, AuthModule],

      providers: [
        {
          provide: UserRedisService,
          useValue: {
            setVerificationCode: jest.fn(),
            getVerificationCode: jest.fn(),
            deleteVerificationCode: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    AppGlobal.beforeAll(app);
    await app.init();

    userRedisService = moduleRef.get<UserRedisService>(UserRedisService);
    prisma = AppGlobal.prisma;
    httpServer = await app.getHttpServer();

    newUser = {
      email: 'new_user@example.com',
      password: 'newPasword1!@#',
      nick_name: 'newUser',
      verificationCode: '123456',
    };

    testUser = {
      email: 'test_user@example.com',
      nick_name: 'testUser',
      password: 'testPassword1!@#',
    };

    const password = await globalBcryptUtil.hash(testUser.password);

    await prisma.users.create({
      data: {
        email: 'test_user@example.com',
        nick_name: 'testUser',
        password,
      },
    });
  });

  describe('/user, [이메일 유효성 검사]', () => {
    it('/isAlreadyEmail (POST) [성공]', async () => {
      const response = await request(httpServer)
        .post('/user/isAlreadyEmail')
        .send({ email: newUser.email });

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({ status: 'success' });
    });

    it('/isAlreadyEmail (POST) [실패: 이메일 형식에 맞지 않음]', async () => {
      const response = await request(httpServer)
        .post('/user/isAlreadyEmail')
        .send({ email: 'hello' });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '사용할 수 없는 이메일입니다.',
        status: 'exception',
      });
    });

    it('/isAlreadyEmail (POST) [실패: 이미 가입된 이메일]', async () => {
      const response = await request(httpServer)
        .post('/user/isAlreadyEmail')
        .send({ email: testUser.email });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '사용할 수 없는 이메일입니다.',
        status: 'exception',
      });
    });
  });

  describe('/user, [닉네임 유효성 검사]', () => {
    it('/checkName (POST) [성공]', async () => {
      const response = await request(httpServer)
        .post('/user/checkName')
        .send({ nick_name: newUser.nick_name });

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({ status: 'success' });
    });

    it('/checkName (POST) [실패: 닉네임 형식에 맞지 않음]', async () => {
      const response = await request(httpServer)
        .post('/user/checkName')
        .send({ nick_name: 'n' });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '사용할 수 없는 이름입니다.',
        status: 'exception',
      });
    });

    it('/checkName (POST) [실패: 이미 가입된 닉네임]', async () => {
      const response = await request(httpServer)
        .post('/user/checkName')
        .send({ nick_name: testUser.nick_name });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '사용할 수 없는 이름입니다.',
        status: 'exception',
      });
    });
  });

  describe('/user, [비밀번호 유효성 검사]', () => {
    it('/checkPassword (POST) [성공]', async () => {
      const response = await request(httpServer)
        .post('/user/checkPassword')
        .send({ password: newUser.password });

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({
        status: 'success',
        data: { passwordStrength: '매우 강함' },
      });
    });

    it('/checkPassword (POST) [실패: 비밀번호 형식에 맞지 않음]', async () => {
      const response = await request(httpServer)
        .post('/user/checkPassword')
        .send({ password: 'test' });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '사용할 수 없는 비밀번호입니다.',
        status: 'exception',
      });
    });
  });

  describe('/user, [이메일 인증코드 전송]', () => {
    it('/sendVerificationCode (POST) [성공]', async () => {
      const redisInfo: UserRedisSetVerificationCode = {
        email: newUser.email,
        verificationCode: '123456',
        time: 60 * 5,
      };
      await userRedisService.setVerificationCode(redisInfo);
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValueOnce(null),
      });

      const response = await request(httpServer)
        .post('/user/sendVerificationCode')
        .send({ email: newUser.email });

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({ status: 'success' });

      await userRedisService.deleteVerificationCode({ email: newUser.email });
    });

    it('/sendVerificationCode (POST) [실패: RedisError]', async () => {
      jest
        .spyOn(userRedisService, 'setVerificationCode')
        .mockRejectedValueOnce(
          new InternalServerErrorException('잠시 후 다시 시도해 주세요.'),
        );
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValueOnce(null),
      });

      const response = await request(httpServer)
        .post('/user/sendVerificationCode')
        .send({ email: newUser.email });

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '잠시 후 다시 시도해 주세요.',
        status: 'exception',
      });
    });

    it('/sendVerificationCode (POST) [실패: 메일 전송 실패]', async () => {
      const redisInfo: UserRedisSetVerificationCode = {
        email: newUser.email,
        verificationCode: '123456',
        time: 60 * 5,
      };
      await userRedisService.setVerificationCode(redisInfo);

      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockRejectedValueOnce(null),
      });

      const response = await request(httpServer)
        .post('/user/sendVerificationCode')
        .send({ email: newUser.email });

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '이메일 전송에 실패하였습니다.',
        status: 'exception',
      });

      await userRedisService.deleteVerificationCode({ email: newUser.email });
    });
  });

  describe('/user, [회원가입]', () => {
    it('/signUp (POST) [성공]', async () => {
      const redisInfo: UserRedisSetVerificationCode = {
        email: newUser.email,
        verificationCode: '123456',
        time: 60 * 5,
      };

      await userRedisService.setVerificationCode(redisInfo);

      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({
        status: 'success',
        data: {
          email: response.body.data.email,
        },
      });

      const { id, email } = await prisma.users.findUnique({
        where: {
          email: response.body.data.email,
        },
      });

      await userRedisService.deleteVerificationCode({ email });

      await prisma.users.delete({
        where: {
          id,
        },
      });
    });

    it('/signUp (POST) [실패: 인증번호 불일치]', async () => {
      const redisInfo: UserRedisSetVerificationCode = {
        email: newUser.email,
        verificationCode: '123436',
        time: 60 * 5,
      };

      await userRedisService.setVerificationCode(redisInfo);

      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '인증번호가 일치하지 않습니다.',
        status: 'exception',
      });

      await userRedisService.deleteVerificationCode({ email: newUser.email });
    });

    it('/signUp (POST) [실패: 인증번호 만료]', async () => {
      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '인증번호 유효기간이 만료되었습니다.',
        status: 'exception',
      });
    });

    it('/signUp (POST) [실패: Redis Error]', async () => {
      jest
        .spyOn(userRedisService, 'getVerificationCode')
        .mockRejectedValueOnce(
          new InternalServerErrorException('잠시 후 다시 시도해 주세요.'),
        );
      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '잠시 후 다시 시도해 주세요.',
        status: 'exception',
      });
    });

    it('/signUp (POST) [실패: DB Error]', async () => {
      const redisInfo: UserRedisSetVerificationCode = {
        email: newUser.email,
        verificationCode: '123456',
        time: 60 * 5,
      };
      await userRedisService.setVerificationCode(redisInfo);

      jest
        .spyOn(prisma, '$transaction')
        .mockRejectedValueOnce(
          new InternalServerErrorException('잠시 후 다시 시도해 주세요.'),
        );

      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '잠시 후 다시 시도해 주세요.',
        status: 'exception',
      });

      await userRedisService.deleteVerificationCode({ email: newUser.email });
    });
  });

  describe('/user, [회원 정보 수정] (PATCH)', () => {
    it('/updateUser (PATCH) [성공]', async () => {
      const loginResponse = await request(httpServer)
        .post('/auth/signIn')
        .send({ email: testUser.email, password: testUser.password });

      const cookies = getCookies(loginResponse.headers['set-cookie'][0]);

      const response = await request(httpServer)
        .patch('/user/updateUser')
        .set('Cookie', `access_token=${cookies['access_token']}`)
        .send({ nick_name: 'newNickName' });

      expect(response.status).toStrictEqual(200);
      expect(response.body.data).toMatchObject({ nick_name: 'newNickName' });
    });

    it('/updateUser (PATCH) [실패: 인증 필요]', async () => {
      const response = await request(httpServer)
        .patch('/user/updateUser')
        .send({ email: testUser.email, nick_name: 'newNickName' });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '로그인이 필요한 서비스입니다.',
        status: 'exception',
      });
    });

    it('/updateUser (PATCH) [실패: DB Error]', async () => {
      const loginResponse = await request(httpServer)
        .post('/auth/signIn')
        .send({ email: testUser.email, password: testUser.password });

      const cookies = getCookies(loginResponse.headers['set-cookie'][0]);

      jest
        .spyOn(prisma, '$transaction')
        .mockRejectedValueOnce(
          new InternalServerErrorException('잠시 후 다시 시도해 주세요.'),
        );

      const response = await request(httpServer)
        .patch('/user/updateUser')
        .set('Cookie', `access_token=${cookies['access_token']}`)
        .send({ email: testUser.email, nick_name: 'newNickName' });

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '잠시 후 다시 시도해 주세요.',
        status: 'exception',
      });
    });
  });

  describe('/user, [회원 탈퇴] (DELETE)', () => {
    it('/deleteUser (DELETE) [성공]', async () => {
      testUser.nick_name = 'newNickName';
      const loginResponse = await request(httpServer)
        .post('/auth/signIn')
        .send({ email: testUser.email, password: testUser.password });
      const isRedisToken = await userRedisService.getVerificationCode({
        email: testUser.email,
      });

      const cookies = getCookies(loginResponse.headers['set-cookie'][0]);

      const response = await request(httpServer)
        .delete('/user/deleteUser')
        .set('Cookie', `access_token=${cookies['access_token']}`)
        .send();

      console.log(response.body);

      expect(isRedisToken).toBeNull();
      expect(response.status).toStrictEqual(302);
      expect(response.body).toStrictEqual({});
    });

    it('/deleteUser (DELETE) [실패: 인증 필요]', async () => {
      const response = await request(httpServer)
        .delete('/user/deleteUser')
        .send({ email: testUser.email });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '로그인이 필요한 서비스입니다.',
        status: 'exception',
      });
    });

    it('/deleteUser (DELETE) [실패: DB Error]', async () => {
      const loginResponse = await request(httpServer)
        .post('/auth/signIn')
        .send({ email: testUser.email, password: testUser.password });

      const cookies = getCookies(loginResponse.headers['set-cookie'][0]);

      jest
        .spyOn(prisma, '$transaction')
        .mockRejectedValueOnce(
          new InternalServerErrorException('잠시 후 다시 시도해 주세요.'),
        );

      const response = await request(httpServer)
        .delete('/user/deleteUser')
        .set('Cookie', `access_token=${cookies['access_token']}`)
        .send({ email: testUser.email });

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '잠시 후 다시 시도해 주세요.',
        status: 'exception',
      });
    });
  });

  function getCookies(cookieString) {
    const cookies = {};
    const pairs = cookieString.split(';');

    for (let i = 0; i < pairs.length; i++) {
      const parts = pairs[i].split('=');
      cookies[parts[0].trim()] = parts[1] ? parts[1].trim() : '';
    }

    return cookies;
  }

  afterAll(async () => {
    await prisma.users.delete({
      where: {
        email: testUser.email,
      },
    });
    await userRedisService.deleteVerificationCode({ email: newUser.email });
    AppGlobal.redis.disconnect();
  });
});
