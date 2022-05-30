import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import { AbstractController } from 'src/misc/abstracts/abstract.controller';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { MessageService } from '../services/message.service';


@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController extends AbstractController{
  constructor(private readonly messageService: MessageService) {super()}

  
}
