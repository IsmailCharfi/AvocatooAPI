import { TimeStamp } from '../../misc/TimeStamp'
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from 'src/misc/enums/roles.enum';

@Entity()
export class User extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column('set', {
    enum: RolesEnum,
  })
  roles: RolesEnum[];

}
