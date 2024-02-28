import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/exception.filter';
import * as cookieParser from 'cookie-parser';
import { configUtil } from './utils/config.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setAppConfig = async <T extends INestApplication>(
  app: T,
): Promise<void> => {
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: [configUtil().getClient()],
    credentials: true,
  });

  await app.listen(configUtil().getPort());
};
