import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import * as cookieParser from 'cookie-parser';
import { ConfigGlobal } from './global/config.global';
import { AppGlobal } from './global/app.global';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    origin: [ConfigGlobal.env.clientUrl],
    credentials: true,
  });
  await AppGlobal.prisma.$connect();
  await app.listen(ConfigGlobal.env.port);

  // await AppGlobal.beforeAll(app);
}
bootstrap();
