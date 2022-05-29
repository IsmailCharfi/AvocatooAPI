import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { isAllowed } from 'src/misc/utils/isAllowed.utils';
import { PageDto } from 'src/misc/utils/pagination/dto/page.dto';
import { Paginator } from 'src/misc/utils/pagination/paginator.utils';
import { User } from 'src/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { AddQuestionDto } from '../dto/question/add-question.dto';
import { GetAllQuestionsDto } from '../dto/question/get-all-questions.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { Category } from '../entities/category.entity';
import { Question } from '../entities/question.entity';
import { CategoryService } from './category.service';


@Injectable()
export class QuestionService {

  readonly ORDER_BY: string = "createdAt"

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private categoryService: CategoryService,
  ) {}

  async addQuestion(addQuestionDto: AddQuestionDto, client: User): Promise<Question> {

    const category = await this.categoryService.getCategoryById(addQuestionDto.category)

    if (!category) throw new ConflictException();

    const question = this.questionRepository.create({client, ...addQuestionDto, category});

    return this.questionRepository.save(question);
  }

  async getAll(getAllQuestionsDto: GetAllQuestionsDto): Promise<PageDto<Question>> {
      const queryBuilder = this.questionRepository.createQueryBuilder();

      return Paginator.paginateAndCreatePage(queryBuilder, getAllQuestionsDto, {field: this.ORDER_BY})
  }

  async getQuestionById(id: string): Promise<Question> {
    const question = await this.questionRepository.findOneBy({id});

    if(!question)
      throw new NotFoundException()

      return question;
}

  async getQuestionsByClient(id: string, getAllQuestionsDto: GetAllQuestionsDto): Promise<PageDto<Question>> {

    const queryBuilder = this.questionRepository.createQueryBuilder();

    queryBuilder.where("client.id like :id", {id})

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

  async softDeleteQuestion(id: string, user: User): Promise<UpdateResult> {
    const question = await this.questionRepository.findOneBy({id});

    if (!isAllowed(user, RolesEnum.ROLE_CLIENT) || question.client.id !== user.id)
        throw new UnauthorizedException();

    return await this.questionRepository.softDelete(id);
  }

  async restoreQuestion(id: string, user: User): Promise<UpdateResult> {
    const question = await this.questionRepository.findOneBy({id});

    if (!isAllowed(user, RolesEnum.ROLE_CLIENT) || question.client.id !== user.id)
        throw new UnauthorizedException();

    return await this.questionRepository.restore(id);
  }
}
