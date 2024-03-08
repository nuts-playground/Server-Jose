import { HttpServer, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setAppConfig } from 'src/common/set-app-config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RepositoryUserResponse } from 'src/user/interface/repository.interface';
import { UserModule } from 'src/user/user.module';
import * as request from 'supertest';

describe('UserService (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let prisma: PrismaService;
  let testUser: RepositoryUserResponse;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await setAppConfig(app);
    await app.init();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    httpServer = await app.getHttpServer();

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
        .send({ email: 'hello@example.com' });

      expect(response.status).toStrictEqual(201);
    });

    // it('/isAlreadyEmail (POST) [실패: 이메일 형식에 맞지 않음]', () => {
    //   return request(httpServer)
    //     .post('/user/isAlreadyEmail')
    //     .send({ email: 'hello' })
    //     .expect(401);
    // });

    // it('/isAlreadyEmail (POST) [실패: 이미 가입된 이메일]', () => {
    //   return request(httpServer)
    //     .post('/user/isAlreadyEmail')
    //     .send({ email: testUser.email })
    //     .expect(401);
    // });
  });

  // describe('/user, [닉네임 유효성 검사]', () => {
  //   it('/checkName (POST) [성공]', () => {
  //     return request(httpServer)
  //       .post('/user/checkName')
  //       .send({ name: 'newUser' })
  //       .expect(201);
  //   });

  //   it('/checkName (POST) [실패: 이미 가입된 닉네임]', () => {
  //     return request(httpServer)
  //       .post('/user/checkName')
  //       .send({ name: testUser.nick_name })
  //       .expect(401);
  //   });
  // });

  afterAll(async () => {
    await prisma.users.delete({
      where: {
        id: testUser.id,
      },
    });
    await app.close();
  });
});
