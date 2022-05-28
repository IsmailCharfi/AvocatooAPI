import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessagingGateway } from './messaging/messaging.gateway';
import { MailModule } from './mail/mail.module';
import { FeedsModule } from './feed/feed.module';
import { QuestionsModule } from './questions/questions.module';
import { MessagingModule } from './messaging/messaging.module';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    MailModule,
    FeedsModule,
    QuestionsModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [MessagingGateway],
})
export class AppModule {}
