import { InjectRepository } from "@nestjs/typeorm";
import { CrudService } from "src/misc/crud.service";
import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";

export class categoryService extends CrudService<Category> {

    constructor(
      @InjectRepository(Category)
      private categoryService: Repository<Category>,
    ) {
      super(categoryService);
    }

    async getCategoryById(id: string,): Promise<Category> {
      return await this.categoryService.findOne({where:{ id }});
    }
  
  }