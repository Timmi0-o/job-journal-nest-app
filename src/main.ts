import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.APP_PORT ?? 3000;

  await app.listen(PORT, '0.0.0.0', () =>
    Logger.log(`Server is running on port ${PORT}`),
  );
}
bootstrap();
