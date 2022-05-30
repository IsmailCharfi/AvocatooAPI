import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import { AbstractController, CreatedResponse, HttpResponse, SuccessResponse } from 'src/misc/abstracts/abstract.controller';
import { GetUser } from 'src/misc/decorators/get-user.decorator';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { User } from 'src/user/entities/user.entity';
import { AddQuestionDto } from '../dto/question/add-question.dto';
import { GetAllQuestionsDto } from '../dto/question/get-all-questions.dto';
import { QuestionService } from '../services/question.service';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionController extends AbstractController{
  constructor(private readonly questionService: QuestionService) {super()}

  @Get()
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAllQuestions(@Body() getAllQuestionsDto: GetAllQuestionsDto): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.questionService.getAll(getAllQuestionsDto));
  }

  @Get('/client/:id')
  getQuestionsByClient(@Param("id") id: string, @Body() getAllQuestionsDto: GetAllQuestionsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.questionService.getQuestionsByClient(id, getAllQuestionsDto));
  }

  @Get("/:id")
  getQuestionById(@Param("id") id: string): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.questionService.getQuestionById(id));
  }

  @Post('/:id')
  addQuestion(@Body() addQuestionDto: AddQuestionDto, @GetUser() user: User): Promise<CreatedResponse> {
    return this.renderCreatedResponse(this.questionService.addQuestion(addQuestionDto, user));
  }

  @Patch('/:id')
  updateQuestion(@Param("id") id: string,  @GetUser() user: User): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.questionService.softDeleteQuestion(id, user));
  }

  @Delete('/:id')
  deleteQuestion(@Param("id") id: string,  @GetUser() user: User): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.questionService.softDeleteQuestion(id, user));
  }

  @Patch('restore/:id')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  restoreQuestion(@Param("id") id: string, @GetUser() user: User): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.questionService.restoreQuestion(id, user));
  }

}
