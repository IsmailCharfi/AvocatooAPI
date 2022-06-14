import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { JwtWsAuthGuard } from 'src/misc/guards/ws.auth.guard';
import { MsgWebSocketDto } from '../dto/msg-web-socket.dto.ts';
import { MessageService } from '../services/message.service';

@WebSocketGateway({
  cors: {origin: '*',},
})
/* @UseGuards(JwtWsAuthGuard)
 */export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private MessageService: MessageService){}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatApp');


  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, msgWebSocketDto: MsgWebSocketDto): Promise<void> {
    console.log(msgWebSocketDto)

    const fromId = msgWebSocketDto.from;
    const toId = msgWebSocketDto.to;

    const message = await this.MessageService.create(msgWebSocketDto)

    this.server.emit(`client-${toId}`, message);
  }

  afterInit(server: Server) {
    this.logger.log('Init Server');
   }
  
   handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
   }
  
   handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
   }
}
