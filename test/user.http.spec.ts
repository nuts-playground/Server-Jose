import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/common/filters/exception.filter';
import * as cookieParser from 'cookie-parser';
import { configUtil } from 'src/common/utils/config.util';
import { prismaUtil } from 'src/common/utils/prisma.util';

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.use(cookieParser());
    app.enableCors({
      origin: [configUtil().getPort()],
      credentials: true,
    });
    await prismaUtil().onModuleInit();
    await app.init();
  });

  describe('POST /user/isAlreadyEmail', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .post('/user/isAlreadyEmail')
        .send({ email: 'hello@test.com' })
        .expect(201);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
