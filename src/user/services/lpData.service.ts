import { Injectable } from "@nestjs/common";
import { CrudService } from "../../misc/crud.service";
import { InjectRepository } from "@nestjs/typeorm";
import { LpData } from "../entities/lp-data.entity";
import { Repository } from "typeorm";
import { LpDataRegisterDto } from "src/auth/dto/register/lp-data-register.dto";
import { Category } from "src/questions/entities/category.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class LpDataService extends CrudService<LpData>{

  constructor(
    @InjectRepository(LpData)
    private lpDataRepository: Repository<LpData>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {
    super(lpDataRepository)
  }

  async create(lpDataRegisterDto: LpDataRegisterDto): Promise<LpData> {

    if(!lpDataRegisterDto) return null;

    const {expertise, image} = lpDataRegisterDto;
 
    const expertiseObjects = await Promise.all( expertise.map( async (expertise: string) => {
        return await this.categoryRepository.findOneBy({id: expertise});
    }))

    const lpData = this.lpDataRepository.create({image, expertise: expertiseObjects});

    return this.lpDataRepository.save(lpData);
   
  }

}
