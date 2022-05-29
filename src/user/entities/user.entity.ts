import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { LpData } from './lp-data.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Exclude } from 'class-transformer';
import { Post } from 'src/feed/entities/post.entity';
@Entity()
export class User extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  phoneNumber: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column( {type: 'enum', enum: RolesEnum})
  role: RolesEnum;

  @Column({nullable: true})
  @Exclude()
  resetPasswordHash: string;

  @Column({nullable: true})
  @Exclude()
  resetPasswordSentAt: Date;
  
  @Column({nullable: true})
  isActivated: boolean;

  @Column({nullable: true})
  @Exclude()
  activationHash: string;

  @Column()
  isOnline: boolean;

  @OneToOne(()=> LpData,{nullable: true, eager: true})
  @JoinColumn()
  lpData: LpData

  @OneToMany(() => Question, (question: Question) => question.client, {nullable: true})
  questions: Question[];

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];
}
