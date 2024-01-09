import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import * as cookieParser from 'cookie-parser';
import { prismaOnModuleInit } from './common/utils/prisma.util';
import { getConfig } from './common/config/global-config.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: [getConfig<string>('CLIENT_URL')],
    credentials: true,
  });
  await prismaOnModuleInit();
  await app.listen(process.env.PORT);
}
bootstrap();
