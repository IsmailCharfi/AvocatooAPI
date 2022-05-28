import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/misc/crud';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { QuestionDto } from './dto/question.dto';
import { Category } from './entities/category.entity';
import { Question } from './entities/question.entity';


@Injectable()
export class QuestionsService extends CrudService<Question> {
    constructor(@InjectRepository(Question)
    private questionRepository: Repository<Question>,   @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    ){
        super(questionRepository)
    }

    async addQuestion(questionDto : QuestionDto): Promise<Question>{
        const {client ,category, ...data}=questionDto;
        const question= this.questionRepository.create(data);
        question.category= await this.categoryRepository.findOne({where :{id:category}});
        question.closed=false;
        question.client = await this.userRepository.findOne({where :{id:client}}); 
        return this.questionRepository.save(question);
    }

    async cancelQuestion (id : string){
        const question =await this.questionRepository.findOne({where : {id}});
        question.closed=true;
        this.questionRepository.save(question);
    }
    async getAllQuestions(id : string): Promise<Question[]> {
    return this.questionRepository.createQueryBuilder().where("client.id = :id", {id}).getMany();
    }

}
