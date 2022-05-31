import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { LpData } from './lp-data.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Post } from 'src/feed/entities/post.entity';
import { AbstractEntity } from 'src/misc/abstracts/abstract.entity';
import { ExportUserSimpleDto } from "../dto/export/export-user-simple.dto";
import { Ticket } from "src/questions/entities/ticket.entity";
@Entity()
export class User extends AbstractEntity  {

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
  password: string;

  @Column()
  salt: string;

  @Column( {type: 'enum', enum: RolesEnum})
  role: RolesEnum;

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

  @OneToMany(() => Question, (question: Question) => question.client, {nullable: true})
  questions: Question[];

  @OneToMany(() => Post, (post: Post) => post.creator)
  posts: Post[];

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.lp)
  lpTickets: Ticket[];

  exportUserSimple(): ExportUserSimpleDto {

    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber,
      role: this.role,
      isActivated: this.isActivated,
      isOnline: this.isOnline,
      lpData: this.lpData ? this.lpData.exportLpDataSimple() : null, 
      createdAt: this.createdAt, 
    }
  }

/*   exportUserWithPosts(): ExportUserWithPostsDto {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber,
      role: this.role,
      isActivated: this.isActivated,
      isOnline: this.isOnline,
      lpData: this.lpData? this.lpData.exportLpDataSimple() : null,
      lpthis.posts   
    }
  } */
}
