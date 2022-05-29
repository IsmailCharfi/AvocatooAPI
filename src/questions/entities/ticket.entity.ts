import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/user/entities/user.entity';
import { Question } from './question.entity';
import { LpData } from 'src/user/entities/lp-data.entity';
import { Message } from './message.entity';

@Entity()
export class Ticket extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isRead: boolean;

  @Column()
  isTyping: boolean;

  @Column()
  closed: boolean;

  @ManyToOne(() => Question, (question: Question) => question.tickets, {eager: true})
  question: Question;

  @ManyToOne(() => LpData, (lp: LpData) => lp.tickets, {eager: true})
  lp : LpData;

  @OneToMany(() => Message, (message: Message) => message.ticket, {eager: true})
  messages: Message[];
 

}
