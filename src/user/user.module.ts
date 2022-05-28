import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './controllers/user.controller';
import { LpData } from './entities/lp-data.entity';
import { LpDataService } from './services/lpData.service';
import { QuestionsModule } from 'src/questions/questions.module';
import { Category } from 'src/questions/entities/category.entity';

@Module({
  imports: [
    AuthModule, 
    QuestionsModule, 
    TypeOrmModule.forFeature([User, LpData, Category])
  ],
  controllers: [UserController],
  exports: [UserService, LpDataService],
  providers: [UserService, LpDataService],
})
export class UserModule {}
