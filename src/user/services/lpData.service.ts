import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LpData } from '../entities/lp-data.entity';
import { Repository, UpdateResult } from 'typeorm';
import { LpDataRegisterDto } from 'src/auth/dto/register/register-lpData.dto';
import { Category } from 'src/questions/entities/category.entity';
import { UpdateLpDataDto } from '../dto/update/update-lpData.dto';

@Injectable()
export class LpDataService {
  constructor(
    @InjectRepository(LpData)
    private lpDataRepository: Repository<LpData>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(lpDataRegisterDto: LpDataRegisterDto): Promise<LpData> {
    if (!lpDataRegisterDto) return null;

    const { expertise, image } = lpDataRegisterDto;

    const expertiseObjects = await Promise.all(
      expertise.map(async (expertise: string) => {
        return await this.categoryRepository.findOneBy({ id: expertise });
      }),
    );

    const lpData = this.lpDataRepository.create({
      image,
      expertise: expertiseObjects,
    });

    return this.lpDataRepository.save(lpData);
  }

  async update(id: string, lpDataUpdateDto: UpdateLpDataDto): Promise<LpData> {
    if (!lpDataUpdateDto) return null;

    const { expertise, image } = lpDataUpdateDto;

    const newExpertiseObjects = await Promise.all(
      expertise.map(async (expertise: string) => {
        return await this.categoryRepository.findOneBy({ id: expertise });
      }),
    );

    return this.lpDataRepository.save({
      id,
      image,
      expertise: newExpertiseObjects,
    });
  }

  async softDelete(id: string): Promise<UpdateResult> {
    const result: UpdateResult = await this.lpDataRepository.softDelete(id);

    if(result.affected == 0) {
      throw new NotFoundException()
    }

    return result
  }

  async restore(id: string): Promise<UpdateResult> {
    const result: UpdateResult = await this.lpDataRepository.restore(id);

    if(result.affected == 0) {
      throw new NotFoundException()
    }

    return result
  }
}
