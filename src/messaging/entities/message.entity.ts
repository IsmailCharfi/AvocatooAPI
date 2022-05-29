import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/user/entities/user.entity';
import { Ticket } from '../../questions/entities/ticket.entity';
import { AbstractEntity } from 'src/misc/abstracts/abstract.entity';

@Entity()
export class Message extends AbstractEntity  {

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
