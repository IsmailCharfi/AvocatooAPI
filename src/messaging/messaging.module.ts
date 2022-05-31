import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { UserModule } from 'src/user/user.module';
import { MessageController } from './controllers/message.controller';
import { Message } from './entities/message.entity';
import { MessageGateway } from './gateways/message.gateway';
import { MessageService } from './services/message.service';
import * as dotenv from "dotenv"

dotenv.config()

@Module({
    imports: [UserModule, QuestionsModule, TypeOrmModule.forFeature([Message]), AuthModule ],
    controllers: [MessageController],
    exports: [MessageService, MessageGateway],
    providers: [MessageService, MessageGateway],
  })
export class MessagingModule {}
