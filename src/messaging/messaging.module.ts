import { Module } from '@nestjs/common';
import { MessageController } from './controllers/message.controller';
import { MessageGateway } from './gateways/message.gateway';
import { MessageService } from './services/message.service';

@Module({
    imports: [],
    controllers: [MessageController],
    exports: [MessageService, MessageGateway],
    providers: [MessageService, MessageGateway],
  })
export class MessagingModule {}
