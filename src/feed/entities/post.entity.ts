import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from 'src/questions/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { AbstractEntity } from "src/misc/abstracts/abstract.entity";

@Entity()
export class Post extends AbstractEntity {

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isAccepted: boolean;

  @ManyToOne(() => Category, (category : Category) => category.posts)
  category: Category;

  @ManyToOne(() => User, (user: User) => user.posts)
  creator: User;
}
