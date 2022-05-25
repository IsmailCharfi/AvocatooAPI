import {SubscribeMessage, WebSocketGateway, WebSocketServer,} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

 type Payload = {
   toId: string
   fromId: string
   text: string
   date: string
 }

 @WebSocketGateway({
   cors: {
     origin: '*',
   },
 })
 export class MessagingGateway  {
 
  @WebSocketServer() server: Server;
 
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: Payload): void {
   this.server.emit(`client-${payload.toId}`, {
     toId: payload.toId,
    fromId: payload.fromId, 
    text: payload.text,
    date: payload.date,
    });
  }
 
 }