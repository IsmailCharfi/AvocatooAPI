import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { PageDto } from 'src/misc/utils/pagination/dto/page.dto';
import { GetAllAdminsDto } from '../dto/get/get-all-admins.dto';
import { GetAllClientsDto } from '../dto/get/get-all-clients.dto';
import { GetAllLpsDto } from '../dto/get/get-all-lps.dto';
import { GetAllUsersDto } from '../dto/get/get-all-users.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(@Query() getAllUsersDto: GetAllUsersDto): Promise<PageDto<User>> {
    return this.userService.getAll(getAllUsersDto);
  }

  @Get("/lp")
  getAllLps(@Query() getAllLpsDto: GetAllLpsDto): Promise<PageDto<User>> {
    return this.userService.getAllLps(getAllLpsDto);
  }

  @Get("/client")
  getAllClients(@Query() getAllClientsDto: GetAllClientsDto): Promise<PageDto<User>> {
    return this.userService.getAllClients(getAllClientsDto);
  }

  @Get("/admin")
  getAllAdmins(@Query() getAllAdminsDto: GetAllAdminsDto): Promise<PageDto<User>> {
    return this.userService.getAllAdmins(getAllAdminsDto);
  }

  @Get("/:id")
  getUseryId(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Get("/lp/:id")
  getLpById(@Param('id') id: string): Promise<User> {
    return this.userService.getLpById(id);
  }

  @Get("/client/:id")
  getClientById(@Param('id') id: string): Promise<User> {
    return this.userService.getClientById(id);
  }

  @Get("/admin/:id")
  getAdminById(@Param('id') id: string): Promise<User> {
    return this.userService.getAdminById(id);
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete("/:id")
  delete(@Param("id") id: string): Promise<SuccessReturn> {
    return this.userService.softDelete(id)
  }

  @Patch("restore/:id")
  restore(@Param("id") id: string): Promise<SuccessReturn> {
    return this.userService.restore(id)
  }

  @Get('activate/:id')
  activateAccount(@Param('id') id: string) {
    return this.userService.activate(id);
  }

  @Get('deactivate/:id')
  deactivateAccount(@Param('id') id: string) {
    return this.userService.deactivate(id);
  }
}
