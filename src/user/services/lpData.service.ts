import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LpData } from '../entities/lp-data.entity';
import { Repository, UpdateResult } from 'typeorm';
import { LpDataRegisterDto } from 'src/auth/dto/register/register-lpData.dto';
import { Category } from 'src/questions/entities/category.entity';
import { UpdateLpDataDto } from '../dto/update/update-lpData.dto';

const DEFAULT_IMAGE = "/public/images/default.png"

@Injectable()
export class LpDataService {
  constructor(
    @InjectRepository(LpData)
    private lpDataRepository: Repository<LpData>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(lpDataRegisterDto: LpDataRegisterDto, image?: Express.Multer.File): Promise<LpData> {
    if (!lpDataRegisterDto) return null;

    const { expertise } = lpDataRegisterDto;

    const imagePath = image?.path || DEFAULT_IMAGE;

    const expertiseObjects = await Promise.all(
      expertise.map(async (expertise: string) => {
        return await this.categoryRepository.findOneBy({ id: expertise });
      }),
    );

    const lpData = this.lpDataRepository.create({expertise: expertiseObjects, image: imagePath});

    return this.lpDataRepository.save(lpData);
  }

  async update(id: string, lpDataUpdateDto: UpdateLpDataDto, image?: Express.Multer.File): Promise<LpData> {
    if (!lpDataUpdateDto) return null;

    const lpData = await this.lpDataRepository.findOneBy({id});

    const { expertise } = lpDataUpdateDto;
    const imagePath = image?.path || lpData.image || DEFAULT_IMAGE;

    const newExpertiseObjects = await Promise.all(
      expertise.map(async (expertise: string) => {
        return await this.categoryRepository.findOneBy({ id: expertise });
      }),
    );

    return this.lpDataRepository.save({
      id,
      expertise: newExpertiseObjects,
      image: imagePath
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
