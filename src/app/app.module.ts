import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import RedisStore from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import ms from 'ms';
import passport from 'passport';

import { BaseDocumentsModule } from '@/database/base-documents.module';
import { AuthModule } from '@/resources/auth/auth.module';
import { FontModule } from '@/resources/font/font.module';
import { UserModule } from '@/resources/user/user.module';
import { RedisModule } from '@/session/redis.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      autoIndex: true, // this should be disabled in production
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),

    BaseDocumentsModule,
    AuthModule,
    FontModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  constructor(
    @Inject('REDIS')
    private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({ client: this.redis, logErrors: true }),
          secret: this.configService.get<string>('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
          cookie: {
            maxAge: ms(this.configService.get<string>('SESSION_LIFETIME')),
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
