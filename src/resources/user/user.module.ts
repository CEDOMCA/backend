import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MailModule } from '@/mail/mail.module';

import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserProfile } from './user.profile';
import { UserService } from './user.service';

@Module({
  imports: [MailModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, UserProfile],
  exports: [UserService],
})
export class UserModule {}
