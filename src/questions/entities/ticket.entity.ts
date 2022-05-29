import { TimeStamp } from '../../misc/abstracts/time-stamp.absratct.entity'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/user/entities/user.entity';
import { Question } from './question.entity';
import { LpData } from 'src/user/entities/lp-data.entity';
import { Message } from '../../messaging/entities/message.entity';
import { AbstractEntity } from 'src/misc/abstracts/abstract.entity';

@Entity()
export class Ticket extends AbstractEntity {

  @Column()
  isRead: boolean;

  @Column()
  isTyping: boolean;

  @Column()
  closed: boolean;

  @Column()
  closedAt: Date;

  @ManyToOne(() => Question, (question: Question) => question.tickets, {eager: true})
  question: Question;

  @ManyToOne(() => LpData, (lp: LpData) => lp.tickets, {eager: true})
  lp : LpData;

  @OneToMany(() => Message, (message: Message) => message.ticket, {eager: true})
  messages: Message[];
 

}
