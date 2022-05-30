import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { PageDto } from 'src/misc/utils/pagination/dto/page.dto';
import { GetAllAdminsDto } from '../dto/get/get-all-admins.dto';
import { GetAllClientsDto } from '../dto/get/get-all-clients.dto';
import { GetAllLpsDto } from '../dto/get/get-all-lps.dto';
import { GetAllUsersDto } from '../dto/get/get-all-users.dto';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update/update-user.dto';
import { AbstractController, SuccessResponse } from 'src/misc/abstracts/abstract.controller';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { LpImageConfig } from 'src/misc/multer-config/lp-image.config';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController extends AbstractController{
  constructor(private readonly userService: UserService) {super()}

  @Get()
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAll(@Query() getAllUsersDto: GetAllUsersDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getAll(getAllUsersDto));
  }

  @Get("/lp")
  getAllLps(@Query() getAllLpsDto: GetAllLpsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getAllLps(getAllLpsDto));
  }

  @Get("/client")
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAllClients(@Query() getAllClientsDto: GetAllClientsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getAllClients(getAllClientsDto));
  }

  @Get("/admin")
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAllAdmins(@Query() getAllAdminsDto: GetAllAdminsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getAllAdmins(getAllAdminsDto));
  }

  @Get("/:id")
  getUseryId(@Param('id') id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getUserById(id));
  }

  @Get("/lp/:id")
  getLpById(@Param('id') id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getLpById(id));
  }

  @Get("/client/:id")
  getClientById(@Param('id') id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getClientById(id));
  }

  @Get("/admin/:id")
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAdminById(@Param('id') id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.getAdminById(id));
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.update(id, updateUserDto))
  }

  @Patch("lp/:id")
  @Roles(RolesEnum.ROLE_ADMIN, RolesEnum.ROLE_LP)
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('imageFile', LpImageConfig))
  updateLp(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.update(id, updateUserDto))
  }

  @Delete("/:id")
  delete(@Param("id") id: string): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.userService.softDelete(id));
  }

  @Patch("restore/:id")
  restore(@Param("id") id: string): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.userService.restore(id));
  }

  @Post('activate/:id')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  activateAccount(@Param('id') id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.activate(id));
  }

  @Post('deactivate/:id')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  deactivateAccount(@Param('id') id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.userService.deactivate(id));
  }
}
