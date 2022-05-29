import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { isAllowed } from 'src/misc/utils/isAllowed.utils';
import { PageDto } from 'src/misc/utils/pagination/dto/page.dto';
import { Paginator } from 'src/misc/utils/pagination/paginator.utils';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AddQuestionDto } from '../dto/question/add-question.dto';
import { GetAllQuestionsDto } from '../dto/question/get-all-questions.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { Category } from '../entities/category.entity';
import { Question } from '../entities/question.entity';
import { categoryService } from './category.service';
@Injectable()
export class QuestionsService {

    readonly ORDER_BY: string = "createdAt"

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private categoryService: categoryService,
  ) {}

  async addQuestion(addQuestionDto: AddQuestionDto, client: User): Promise<Question> {

    const category = await this.categoryService.getCategoryById(addQuestionDto.category)

    if (!category) throw new ConflictException();

    const question = this.questionRepository.create({client, ...addQuestionDto, category});

    return this.questionRepository.save(question);
  }

  async getAllQuestions(getAllQuestionsDto: GetAllQuestionsDto): Promise<PageDto<Question>> {
      const queryBuilder = this.questionRepository.createQueryBuilder();

      return Paginator.paginateAndCreatePage(queryBuilder, getAllQuestionsDto, {field: this.ORDER_BY})
  }

  async getQuestionsByClient(getAllQuestionsDto: GetAllQuestionsDto, client: User): Promise<PageDto<Question>> {

    const queryBuilder = this.questionRepository.createQueryBuilder();

    queryBuilder.where("client.id like :id", {id: client.id})

    return Paginator.paginateAndCreatePage(queryBuilder, getAllQuestionsDto, {field: this.ORDER_BY})
  }

  async updateQuestion(id: string, updateQuestionDto: UpdateQuestionDto, user: User): Promise<Question> {

    const questionToUpdate = await this.questionRepository.findOneBy({id});
    let category : Category = questionToUpdate.category;

    if (!isAllowed(user, RolesEnum.ROLE_CLIENT) || questionToUpdate.client.id !== user.id)
        throw new UnauthorizedException();

    if (category.id !== updateQuestionDto.category){
        category = await this.categoryService.getCategoryById(updateQuestionDto.category);
    }

    return this.questionRepository.save({...questionToUpdate, ...updateQuestionDto, category})
  }

  async softDeleteQuestion(id: string, user: User): Promise<SuccessReturn> {
    const question = await this.questionRepository.findOneBy({id});

    if (!isAllowed(user, RolesEnum.ROLE_CLIENT) || question.client.id !== user.id)
        throw new UnauthorizedException();
    
    await this.questionRepository.softDelete(id);

    return {}
  }

  async restoreQuestion(id: string, user: User): Promise<SuccessReturn> {
    const question = await this.questionRepository.findOneBy({id});

    if (!isAllowed(user, RolesEnum.ROLE_CLIENT) || question.client.id !== user.id)
        throw new UnauthorizedException();
    
    await this.questionRepository.restore(id);

    return {}
  }
}
