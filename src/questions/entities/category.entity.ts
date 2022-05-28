import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LpData } from 'src/user/entities/lp-data.entity';
import { Question } from './question.entity';
import { Post} from 'src/feed/entities/post.entity';

@Entity()
export class Category extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => LpData, (lpData: LpData) => lpData.expertise)
  experts: LpData[];

  @OneToMany(() => Question, (question: Question) => question.category)
  questions: Question[];

  @OneToMany(() => Post, (post: Post) => post.category)
  posts: Post[];
}
