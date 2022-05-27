import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/users/entities/user.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class Message extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {eager: true})
  from : User;

  @ManyToOne(() => User, {eager: true})
  to : User;

  @Column()
  date: Date;

  @Column()
  content: string;
  
  @ManyToOne(() => Ticket, (ticket: Ticket) => ticket.messages)
  ticket: Ticket;
}
