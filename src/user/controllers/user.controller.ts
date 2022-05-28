import { Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
    ) {}
  
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get("/lp")
  getAllLps(): Promise<User[]> {
    return this.userService.getAllLps();
  }

  @Get("/client")
  getAllClients(): Promise<User[]> {
    return this.userService.getAllClients();
  }

  @Get("/admin")
  getAllAdmins(): Promise<User[]> {
    return this.userService.getAllAdmins();
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

  @Get('activate/:id')
  activateAccount(@Param('id') id: string) {
    return this.userService.activate(id);
  }

  @Get('deactivate/:id')
  deactivateAccount(@Param('id') id: string) {
    return this.userService.deactivate(id);
  }
}
