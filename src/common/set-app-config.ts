import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/exception.filter';
import * as cookieParser from 'cookie-parser';
import { configUtil } from './utils/config.util';
import { commonPrismaUtil } from './utils/prisma.util';

export const setAppConfig = async <T extends INestApplication>(
  app: T,
): Promise<void> => {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: [configUtil().getClient()],
    credentials: true,
  });
  await commonPrismaUtil().onModuleInit();
  await app.listen(configUtil().getPort());
};
