import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [] });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

void bootstrap();
