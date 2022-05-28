import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { categoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UserModule } from 'src/users/user.module';
import { Post } from 'src/feed/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Question } from './entities/question.entity';

@Module({
  imports: [UserModule,TypeOrmModule.forFeature([Category,User,Question])],
  controllers: [QuestionsController , ],
  providers: [QuestionsService,categoryService,TypeOrmModule]
})
export class QuestionsModule {}
