import { Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { Category } from 'src/questions/entities/category.entity';
import { Post } from './entities/post.entity';

@Module({
  imports:[UserModule, QuestionsModule, TypeOrmModule.forFeature([Post, Category, User])],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedsModule {}
