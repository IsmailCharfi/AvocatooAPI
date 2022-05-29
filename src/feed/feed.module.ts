import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { Category } from 'src/questions/entities/category.entity';
import { Post } from './entities/post.entity';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';

@Module({
  imports:[UserModule, QuestionsModule, TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class FeedModule {}
