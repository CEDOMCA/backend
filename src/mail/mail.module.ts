import { join } from 'path';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { link } from '@/mail/helpers';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SENDGRID_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('SENDGRID_USERNAME'),
            pass: configService.get<string>('SENDGRID_PASSWORD'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter({
            link,
          }),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
