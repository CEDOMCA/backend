import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordRecoveryEmail(
    email: string,
    fullName: string,
    recoverPassordUrl: string,
  ): Promise<void> {
    const options = {
      to: email,
      subject: 'CEDOMCA - Recuperação de senha',
      template: 'password-recovery',
      context: {
        fullName,
        recoverPassordUrl,
      },
    };

    await this.mailerService.sendMail(options);
  }
}
