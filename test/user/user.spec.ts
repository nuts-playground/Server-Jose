import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from 'src/common/filters/exception.filter';
import { configUtil } from 'src/common/utils/config.util';
import { prismaUtil } from 'src/common/utils/prisma.util';
import { UserModule } from 'src/user/user.module';
import * as request from 'supertest';

describe('User', () => {
  let app;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = module.createNestApplication();
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
});
