import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";

export class categoryService{

    constructor(
      @InjectRepository(Category)
      private categoryService: Repository<Category>,
    ) {}

    async getCategoryById(id: string,): Promise<Category> {
      return await this.categoryService.findOne({where:{ id }});
    }
  
  }