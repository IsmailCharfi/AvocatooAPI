import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { LpData } from './lp-data.entity';
import { Question } from 'src/questions/entities/question.entity';

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
  userName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column('set', {
    enum: RolesEnum,
  })
  roles: RolesEnum[];

  @Column({nullable: true})
  resetPasswordHash: string;

  @Column({nullable: true})
  resetPasswordSentAt: Date;
  
  @Column({nullable: true})
  isActivated: boolean;

  @Column({nullable: true})
  activationHash: string;

  @Column()
  isOnline: boolean;

  @OneToOne(()=> LpData,{nullable: true, eager: true})
  @JoinColumn()
  lpData: LpData

  @OneToMany(() => Question, (question: Question) => question.client)
  questions: Question[];

}
