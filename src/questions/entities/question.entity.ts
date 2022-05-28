import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/user/entities/user.entity';
import { Category } from './category.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class Question extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  closed: boolean;

  @ManyToOne(() => User, (user: User) => user.questions, {eager: true})
  client: User;

  @ManyToOne(() => Category, (category: Category) => category.questions, {eager: true})
  category: Category
  
  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.question)
  tickets: Ticket[]  

}
