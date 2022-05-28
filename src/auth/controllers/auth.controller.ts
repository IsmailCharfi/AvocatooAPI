import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../../user/entities/user.entity';
import { RegisterDto } from '../dto/register/register.dto';
import { CredenialsDto } from '../dto/credenials.dto';
import { LoginResponeDto } from '../dto/login-respone.dto';
import { AdminLoginResponeDto } from '../dto/admin-login-response.dto';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { HashValidityDto } from '../dto/hash-validity.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { HashValidityInputDto } from '../dto/hash-validity-input.dto';

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

  @Post('/reset-password/hash/valid')
  checkHashValidity(@Body() hashValidityInputDto: HashValidityInputDto): Promise<HashValidityDto> {
    const {hash} = hashValidityInputDto;
    return this.authService.checkResetHashValidity(hash);
  }

  @Post('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<User> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('activate/hash/:hash')
  activateAccountViaHash(@Param('hash') hash: string) {
    return this.authService.activateAccountViaHash(hash);
  }

  @Post('login/:admin?')
  login(
    @Body() credentialsDto: CredenialsDto,
    @Param('admin') admin: string,
  ): Promise<LoginResponeDto | AdminLoginResponeDto> {
    return this.authService.login(credentialsDto, !!admin);
  }
}
