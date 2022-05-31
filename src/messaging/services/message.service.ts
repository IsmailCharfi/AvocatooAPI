import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketService } from 'src/questions/services/ticket.service';
import { UserService } from 'src/user/services/user.service';
import { Repository } from 'typeorm';
import { MsgWebSocketDto } from '../dto/msg-web-socket.dto.ts';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
    private ticketService: TicketService
  ) {}

  async create(msgWebSocketDto: MsgWebSocketDto): Promise<Message>{

    const from = await this.userService.getUserById(msgWebSocketDto.from)
    const to = await this.userService.getUserById(msgWebSocketDto.to)
    const ticket = await this.ticketService.getTicketById(msgWebSocketDto.ticket)
    const message = this.messageRepository.create({...msgWebSocketDto, from, to, ticket})

    return this.messageRepository.save(message);
  }
}
