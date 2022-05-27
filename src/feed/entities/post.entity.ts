import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LpData } from 'src/users/entities/lp-data.entity';

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

  @ManyToOne(() => LpData, (lp: LpData) => lp.posts)
  lp: LpData;
}
