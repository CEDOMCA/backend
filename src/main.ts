import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import ms from 'ms';
import passport from 'passport';

import { AppModule } from '@/app/app.module';
import { setupApiSpec } from '@/docs/setup-api-spec';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * NOTE: in production, we should not expose the specification.
   */
  setupApiSpec(app);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: ms(process.env.SESSION_LIFETIME),
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
