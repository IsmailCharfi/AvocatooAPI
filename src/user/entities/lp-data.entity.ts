import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from 'src/questions/entities/category.entity';
import { User } from './user.entity';
import { Ticket } from 'src/questions/entities/ticket.entity';
import { AbstractEntity } from 'src/misc/abstracts/abstract.entity';
import { ExportLpDataSimpleDto } from "../dto/export/export-lpData-simple.dto";

@Entity()
export class LpData extends AbstractEntity {

  @Column()
  image: string;

  @ManyToMany(() => Category, (category: Category) => category.experts, {eager: true})
  @JoinTable()
  expertise: Category[];

  @OneToOne(() => User, (user: User) => user.lpData)
  user: User;

  exportLpDataSimple(): ExportLpDataSimpleDto {

    const expertise = this.expertise.map(expertise => expertise.exportCategorySimple())

    return {
      id: this.id,
      image: this.image,
      expertise, 
    }
  }

 
}
