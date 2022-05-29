import { Body, Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import { GetUser } from 'src/misc/decorators/get-user.decorator';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { User } from 'src/user/entities/user.entity';
import { AddQuestionDto } from '../dto/question/add-question.dto';
import { GetAllQuestionsDto } from '../dto/question/get-all-questions.dto';
import { QuestionsService } from '../services/questions.service';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAllQuestions(@Body() getAllQuestionsDto: GetAllQuestionsDto) {
    return this.questionsService.getAllQuestions(getAllQuestionsDto);
  }

  @Get('/client')
  getQuestionsByClient(@Body() getAllQuestionsDto: GetAllQuestionsDto, @GetUser() user: User) {
    return this.questionsService.getQuestionsByClient(getAllQuestionsDto, user);
  }

  @Post('/:id')
  addQuestion(@Body() addQuestionDto: AddQuestionDto, @GetUser() user: User) {
    return this.questionsService.addQuestion(addQuestionDto, user);
  }

  @Post('/:id')
  updateQuestion(@Param("id") id: string,  @GetUser() user: User) {
    return this.questionsService.softDeleteQuestion(id, user);
  }

  @Patch('/:id')
  restoreQuestion(@Param("id") id: string, @GetUser() user: User) {
    return this.questionsService.restoreQuestion(id, user);
  }

}
