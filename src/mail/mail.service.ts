import { join } from 'path';

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  async sendEmailToRecoverPassword(
    email: string,
    fullName: string,
    recoverPasswordUrl: string,
  ): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      from: this.configService.get<string>('SENDGRID_EMAIL_SENDER'),
      subject: 'CEDOMCA - Recuperação de senha',
      template: join(__dirname, 'templates', 'recover-password'),
      context: {
        fullName,
        recoverPasswordUrl,
      },
    });
  }
}
