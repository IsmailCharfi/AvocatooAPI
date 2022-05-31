import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import { AbstractController } from 'src/misc/abstracts/abstract.controller';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { Message } from '../entities/message.entity';
import { MessageService } from '../services/message.service';


@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController extends AbstractController{
  constructor(private readonly messageService: MessageService) {super()}

  @Get("/ticket/:id")
  getMessages(@Param("id") id: string) :Promise<Message[]>{
    return this.messageService.getMessagesByTicket(id);
  }
  
}
