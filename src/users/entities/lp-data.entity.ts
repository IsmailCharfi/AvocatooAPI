import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from 'src/questions/entities/category.entity';
import { User } from './user.entity';
import { Ticket } from 'src/questions/entities/ticket.entity';
import { Post } from 'src/feed/entities/post.entity';

@Entity()
export class LpData extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @ManyToMany(() => Category, (category: Category) => category.experts, {eager: true})
  @JoinTable()
  expertise: Category[];

  @OneToOne(() => User, (user: User) => user.lpData)
  @JoinColumn()
  user: User;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.lp)
  tickets: Ticket[];

  @OneToMany(() => Post, (post: Post) => post.lp)
  posts: Post[];
}
