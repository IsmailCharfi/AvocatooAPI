import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import { AbstractController, CreatedResponse, SuccessResponse } from 'src/misc/abstracts/abstract.controller';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { AddCategoryDto } from '../dto/category/add-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { CategoryService } from '../services/category.service';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController extends AbstractController{
  constructor(private readonly categoryService: CategoryService) {super()}

  @Get()
  getAllCategories(): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.categoryService.getAll());
  }

  @Get('/:id')
  getCategoryById(@Param("id") id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.categoryService.getCategoryById(id));
  }

  @Post()
  // @Roles(RolesEnum.ROLE_ADMIN)
  // @UseGuards(RoleGuard)
  addCategory(@Body() addCategory: AddCategoryDto): Promise<CreatedResponse> {
      return this.renderCreatedResponse(this.categoryService.create(addCategory))
  }

  @Patch("/:id")
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  upadteCategory(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CreatedResponse> {
      return this.renderCreatedResponse(this.categoryService.update(id, updateCategoryDto))
  }

  @Delete('/:id')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  deleteCategory(@Param("id") id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.categoryService.softDelete(id));
  }

  @Patch('/restore/:id')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  restore(@Param("id") id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.categoryService.restore(id));
  }
}
