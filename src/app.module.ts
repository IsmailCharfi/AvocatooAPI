import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { FeedModule } from './feed/feed.module';
import { QuestionsModule } from './questions/questions.module';
import { MessagingModule } from './messaging/messaging.module';
import * as dotenv from 'dotenv';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
dotenv.config();
@Module({
  imports: [
    ServeStaticModule.forRoot({rootPath: join(__dirname, "..", 'public'), serveRoot: "/public"}),
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
    FeedModule,
    QuestionsModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
