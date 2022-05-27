import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { Injectable } from '@nestjs/common';
import {resolve} from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

    async sendResetPasswordMail(to: string, payload: {hash: string, name:string}): Promise<SentMessageInfo>{
            return await this.mailerService.sendMail({
                from: process.env.MAIL_USER,
                to,
                subject: 'Réinitialisation de mot de passe',
                template: resolve("./templates/reset-password.hbs"),
                context: { name: payload.name, hash: payload.hash },
            });
    }
}
