import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { CredenialsDto } from './dto/credenials.dto';
import { LoginResponeDto } from './dto/login-respone.dto';
import { AdminLoginResponeDto } from './dto/admin-login-response.dto';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { HashValidityDto } from './dto/hash-validity.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/client')
  registerClient(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto, RolesEnum.ROLE_CLIENT);
  }

  @Post('register/lp')
  registerLp(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto, RolesEnum.ROLE_LP);
  }

  @Post('register/admin')
  registerAdmin(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto, RolesEnum.ROLE_ADMIN);
  }

  @Get('/reset-password/hash/valid/:hash')
  checkHashValidity(@Param('hash') hash: string): Promise<HashValidityDto> {
    return this.authService.checkHashValidity(hash);
  }

  @Post('login/:admin?')
  login(
    @Body() credentialsDto: CredenialsDto,
    @Param('admin') admin: string,
  ): Promise<LoginResponeDto | AdminLoginResponeDto> {
    return this.authService.login(credentialsDto, !!admin);
  }
}
