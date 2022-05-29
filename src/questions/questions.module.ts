import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Question } from './entities/question.entity';
import { Message } from '../messaging/entities/message.entity';
import { Ticket } from './entities/ticket.entity';
import { CategoryController } from './controllers/category.controller';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { CategoryService } from './services/category.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';

@Module({
  imports: [ 
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Category, Question, Ticket])
  ],
  controllers: [QuestionController, CategoryController, TicketController ],
  providers: [QuestionService, CategoryService, TicketService],
  exports: [QuestionService, CategoryService, TicketService]
})
export class QuestionsModule {}
