import {
  HttpServer,
  INestApplication,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setAppConfig } from 'src/common/set-app-config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RepositoryUserResponse } from 'src/user/interface/repository.interface';
import { UserRedisService } from 'src/user/providers/user-redis.service';
import { UserModule } from 'src/user/user.module';
import * as request from 'supertest';
import * as nodemailer from 'nodemailer';
import { RedisService } from 'src/redis/redis.service';

interface NewUser {
  email: string;
  nick_name: string;
  password: string;
  verificationCode: string;
}

describe('UserService (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let prisma: PrismaService;
  let redis: UserRedisService;
  let redisService: RedisService;
  let testUser: RepositoryUserResponse;
  let newUser: NewUser;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [
        {
          provide: UserRedisService,
          useValue: {
            setVerificationCode: jest.fn(),
            getVerificationCode: jest.fn(),
            deleteVerificationCode: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await setAppConfig(app);
    await app.init();

    redisService = moduleRef.get<RedisService>(RedisService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    redis = moduleRef.get<UserRedisService>(UserRedisService);
    httpServer = await app.getHttpServer();

    newUser = {
      email: 'new_user@example.com',
      password: 'testPasword1!@#',
      nick_name: 'newUser',
      verificationCode: '123456',
    };
    testUser = await prisma.users.create({
      data: {
        email: 'test_user@example.com',
        nick_name: 'testUser',
        password: 'testPassword!@#',
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
      jest.spyOn(redis, 'setVerificationCode').mockResolvedValue(null);
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(null),
      });

      const response = await request(httpServer)
        .post('/user/sendVerificationCode')
        .send({ email: testUser.email });

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({ status: 'success' });
    });

    it('/sendVerificationCode (POST) [실패: RedisError]', async () => {
      jest.spyOn(redis, 'setVerificationCode').mockImplementation(() => {
        throw new InternalServerErrorException(
          '인증번호 전송에 실패하였습니다.',
        );
      });
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(null),
      });

      const response = await request(httpServer)
        .post('/user/sendVerificationCode')
        .send({ email: newUser.email });

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '인증번호 전송에 실패하였습니다.',
        status: 'exception',
      });
    });

    it('/sendVerificationCode (POST) [실패: 메일 전송 실패]', async () => {
      jest.spyOn(redis, 'setVerificationCode').mockResolvedValue(null);
      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: jest.fn().mockRejectedValue(null),
      });
      const response = await request(httpServer)
        .post('/user/sendVerificationCode')
        .send({ email: newUser.email });

      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '인증번호 전송에 실패하였습니다.',
        status: 'exception',
      });
    });
  });

  describe('/user, [회원가입]', () => {
    it('/signUp (POST) [성공]', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue('123456');
      jest.spyOn(redisService, 'del').mockResolvedValue(1);

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

      const { id } = await prisma.users.findUnique({
        where: {
          email: response.body.data.email,
        },
      });

      await prisma.users.delete({
        where: {
          id,
        },
      });
    });

    it('/signUp (POST) [실패: 인증번호 불일치]', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue('123453');
      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        statusCode: 401,
        message: '인증번호가 일치하지 않습니다.',
        status: 'exception',
      });
    });

    it('/signUp (POST) [실패: 인증번호 만료]', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
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
      jest.spyOn(redisService, 'get').mockRejectedValue(null);
      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);

      expect(response.status).toStrictEqual(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: '잠시 후 다시 시도해 주세요.',
        status: 'exception',
      });
    });

    it('/signUp (POST) [실패: DB Error]', async () => {
      jest.spyOn(prisma.users, 'create').mockRejectedValue(null);
      const response = await request(httpServer)
        .post('/user/signUp')
        .send(newUser);
      console.log(response);
      expect(response.status).toStrictEqual(500);
      expect(response.body).toStrictEqual({
        statusCode: 500,
        message: '잠시 후 다시 시도해 주세요.',
        status: 'exception',
      });
    });
  });

  afterAll(async () => {
    await prisma.users.delete({
      where: {
        id: testUser.id,
      },
    });

    redisService.disconnect();
    await app.close();
  });
});
