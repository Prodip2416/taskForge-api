import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO তে নেই এমন field strip করবে
      forbidNonWhitelisted: true, // extra field আসলে error দেবে
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,  // type auto-transform করবে
      },
    }),
  );
  await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();
