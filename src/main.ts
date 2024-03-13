import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppGlobal } from './app.global';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await AppGlobal.beforeAll(app);
}
bootstrap();
