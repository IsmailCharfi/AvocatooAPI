import { TimeStamp } from '../../misc/abstracts/time-stamp.absratct.entity'
import { PrimaryGeneratedColumn } from "typeorm";


export abstract class AbstractEntity extends TimeStamp {

  @PrimaryGeneratedColumn('uuid')
  id: string;

}
