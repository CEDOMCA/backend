import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app/app.module';
import { setupApiSpec } from '@/docs/setup-api-spec';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * NOTE: in production, we should not expose the specification.
   */
  setupApiSpec(app);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
