import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import ms from 'ms';
import * as passport from 'passport';

import { AppModule } from '@/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CEDOMCA API')
    .setDescription('The CEDOMCA API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.use(
    session({
      secret: process.env.MY_SECRET,
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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
