import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4000'],
    credentials: true,
  });

  app.use((req: any, res: any, next: any) => {
    const isWebhook =
      'stripe-signature' in req.headers || 'svix-signature' in req.headers;

    const parser = isWebhook
      ? express.raw({ type: 'application/json', limit: '30mb' })
      : express.json({ limit: '30mb' });

    return parser(req, res, next);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api', {
    exclude: ['/images/{*image}'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
