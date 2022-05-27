import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/users/entities/user.entity';
import { Question } from './question.entity';
import { LpData } from 'src/users/entities/lp-data.entity';
import { Message } from './message.entity';

@Entity()
export class Ticket extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isRead: boolean;

  @Column()
  isTyping: boolean;

  @ManyToOne(() => Question, (question: Question) => question.tickets)
  question: Question;

  @ManyToOne(() => LpData, (lp: LpData) => lp.tickets)
  lp : LpData;

  @OneToMany(() => Message, (message: Message) => message.ticket)
  messages: Message[];
 

}
