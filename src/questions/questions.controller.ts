import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { Question } from './entities/question.entity';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/client/:id')
  getAllQuestions(@Param('id') id: string) {
    return this.questionsService.getAllQuestions(id);
  }

  @Get('/close/:id')
  acceptPost(@Param('id') id: string){
    return this.questionsService.cancelQuestion(id);
  }
}
