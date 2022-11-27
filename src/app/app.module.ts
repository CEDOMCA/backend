import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@/resources/auth/auth.module';
import { UserModule } from '@/resources/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),

    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
