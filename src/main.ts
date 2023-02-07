import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@/app/app.module';
import { setupApiSpec } from '@/docs/setup-api-spec';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * NOTE: in production, we should not expose the specification.
   */
  setupApiSpec(app);

  app.enableCors({
    origin: true, // this should be whitelisted in production
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
