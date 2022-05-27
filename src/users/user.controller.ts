import { Controller, Get, Param, Post} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
    ) {}

  @Get('activate/hash/:hash')
  activateAccountViaHash(@Param('hash') hash: string) {
    return this.authService.activateAccountViaHash(hash);
  }

  @Get('activate/:id')
  activateAccount(@Param('id') id: string) {
    return this.userService.activate(id);
  }
}
