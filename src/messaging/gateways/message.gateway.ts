import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(5200, {
  cors: {origin: '*',},
  
})
export class MessageGateway {
  @WebSocketServer() server: Server;

/*   @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, receivedMessageDto: ReceivedMessageDto): void {
    this.server.emit(`client-${payload.toId}`, {
      toId: payload.toId,
      fromId: payload.fromId,
      text: payload.text,
      date: payload.date,
    });
  } */
}
