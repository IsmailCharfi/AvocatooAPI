import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as dotenv from 'dotenv';
dotenv.config();

import {join} from 'path';
@Module({
imports: [
MailerModule.forRoot({
    transport: {
        service: 'hotmail',
        auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
        },
        },
        defaults: {
        from: '"No Reply" <avocatoo.noreply@gmail.com>',
        },
        template: {
        dir: join(__dirname, 'templates'), 
        adapter: new HandlebarsAdapter(),
        options: {
        strict: true,
        },
        },
})
],
providers: [MailService],
controllers: [MailController],
exports:[MailService]
})
export class MailModule {}