import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { Category } from 'src/questions/entities/category.entity';
import { Post } from './entities/post.entity';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/feed.service';

@Module({
  imports:[UserModule, QuestionsModule, TypeOrmModule.forFeature([Post, Category, User])],
  controllers: [PostController],
  providers: [PostService]
})
export class FeedsModule {}
