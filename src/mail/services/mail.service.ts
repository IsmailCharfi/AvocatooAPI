import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { UserService } from 'src/user/services/user.service';
dotenv.config();

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendResetPasswordMail(to: string) {

    let user = await this.userService.getUserByEmail(to);
    if(!user) return;

    user = await this.userService.createResetPasswordHash(user)

    return await this.mailerService.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Réinitialisation de mot de passe',
      template: resolve('./templates/reset-password.hbs'),
      context: { name: user.email, hash: encodeURIComponent(user.resetPasswordHash) },
    });
  }

  async sendActivationMail(to: string) {

    let user = await this.userService.getUserByEmail(to);
    if(!user || !user.activationHash) return;

    return await this.mailerService.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Activation du compte',
      template: resolve('./templates/activation.hbs'),
      context: { name: user.email, hash: encodeURIComponent(user.activationHash) },
    });
  }

}
