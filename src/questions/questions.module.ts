import { forwardRef, Module } from '@nestjs/common';
import { QuestionsService } from './services/questions.service';
import { QuestionsController } from './controllers/questions.controller';
import { categoryService } from './services/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Question } from './entities/question.entity';
import { Message } from './entities/message.entity';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [ 
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Category, User, Question, Message, Ticket])
  ],
  controllers: [QuestionsController, ],
  providers: [QuestionsService, categoryService]
})
export class QuestionsModule {}
