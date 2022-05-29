import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LpData } from 'src/user/entities/lp-data.entity';
import { Category } from 'src/questions/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Post extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isAccepted: boolean;

  @ManyToOne(() => Category, (category : Category) => category.posts)
  category: Category;

  @ManyToOne(() => User, (user: User) => user.posts)
  user: User;
}
