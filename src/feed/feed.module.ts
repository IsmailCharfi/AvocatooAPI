import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { UserService } from 'src/users/user.service';
import {  categoryService } from 'src/questions/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserModule } from 'src/users/user.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { Category } from 'src/questions/entities/category.entity';
import { Post } from './entities/post.entity';

@Module({
  imports:[UserModule,QuestionsModule, TypeOrmModule.forFeature([Post,Category,User])],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedsModule {}
