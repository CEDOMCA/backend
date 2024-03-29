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
import { SeedModule } from '@/database/seeds/seed.module';
import { GcpStorageModule } from '@/gcp-storage/gcp.storage.module';
import { ArtworkModule } from '@/resources/artwork/artwork.module';
import { AuthModule } from '@/resources/auth/auth.module';
import { DashboardModule } from '@/resources/dashboard/dashboard.module';
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
    ArtworkModule,
    AuthModule,
    FontModule,
    UserModule,
    GcpStorageModule,
    SeedModule,
    DashboardModule,
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
            domain: undefined,
            secure: process.env.NODE_ENV === 'production' ? true : 'auto',
            maxAge: ms(this.configService.get<string>('SESSION_LIFETIME')),
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: false,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
