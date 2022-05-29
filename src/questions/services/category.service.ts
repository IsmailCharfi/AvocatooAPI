import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { AddCategoryDto } from "../dto/category/add-category.dto";
import { UpdateCategoryDto } from "../dto/category/update-category.dto";
import { Category } from "../entities/category.entity";

export class CategoryService{

    constructor(
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,
    ) {}

    async getAll(): Promise<Category[]> {
      return await this.categoryRepository.find();
    }

    async getCategoryById(id: string,): Promise<Category> {
      return await this.categoryRepository.findOneBy({id});
    }

    async create(addCategoryDto: AddCategoryDto): Promise<Category> {
      const category = this.categoryRepository.create(addCategoryDto);
      return this.categoryRepository.save(category);
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult> {
      const category =  await this.categoryRepository.update(id, updateCategoryDto)
      if (category.affected === 0) 
        throw new NotFoundException()

      return category
    }

    async softDelete(id: string): Promise<UpdateResult> {
      const result =  await this.categoryRepository.softDelete(id)
      if (result.affected === 0) 
        throw new NotFoundException()

      return result
    }
    
    async restore(id: string): Promise<UpdateResult> {
      const result =  await this.categoryRepository.restore(id)
      if (result.affected === 0) 
        throw new NotFoundException()

      return result
    }
  
  }