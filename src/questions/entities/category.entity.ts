import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LpData } from 'src/user/entities/lp-data.entity';
import { Question } from './question.entity';
import { Post} from 'src/feed/entities/post.entity';
import { AbstractEntity } from 'src/misc/abstracts/abstract.entity';
import { ExportCategorySimpleDto } from "../dto/export/export-category-simple.dto";

@Entity()
export class Category extends AbstractEntity {

  @Column()
  name: string;

  @ManyToMany(() => LpData, (lpData: LpData) => lpData.expertise)
  experts: LpData[];

  @OneToMany(() => Question, (question: Question) => question.category)
  questions: Question[];

  @OneToMany(() => Post, (post: Post) => post.category)
  posts: Post[];

  exportCategorySimple(): ExportCategorySimpleDto {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
