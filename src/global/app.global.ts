import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import * as cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';

export class AppGlobal {
  public static readonly prisma = new PrismaClient({ log: ['query', 'info'] });

  public static readonly configService = new ConfigService();

  public static readonly redis = new Redis({
    host: this.configService.get<string>('REDIS_HOST'),
    port: this.configService.get<number>('REDIS_PORT'),
  });

  public static async beforeAll<T extends INestApplication>(
    app: T,
  ): Promise<void> {
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('NestJS API description')
      .setVersion('0.1')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.use(cookieParser());
    app.enableCors({
      origin: [this.configService.get<string>('CLIENT_URL')],
      credentials: true,
    });

    await app.listen(this.configService.get<string>('PORT'));
    await this.prisma.$connect();
  }
}
