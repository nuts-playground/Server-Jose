import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setAppConfig } from './common/set-app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setAppConfig(app);
}
bootstrap();
