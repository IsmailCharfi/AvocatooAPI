import { Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { QuestionsService } from '../services/questions.service';

@UseGuards(JwtAuthGuard)
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
