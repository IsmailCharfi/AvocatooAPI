import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto } from '../dto/register/register-user.dto';
import { CredenialsDto } from '../dto/credenials.dto';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AbstractController, CreatedResponse, SuccessResponse } from 'src/misc/abstracts/abstract.controller';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RoleGuard } from 'src/misc/guards/role.guard';

@Controller('auth')
export class AuthController extends AbstractController{
  constructor(private readonly authService: AuthService) {super()}

  @Post('register/client')
  registerClient(@Body() registerDto: UserRegisterDto): Promise<CreatedResponse> {
    return this.renderCreatedResponse(this.authService.register(registerDto, RolesEnum.ROLE_CLIENT));
  }

  @Post('register/lp')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  registerLp(@Body() registerDto: UserRegisterDto): Promise<CreatedResponse> {
    return this.renderCreatedResponse(this.authService.register(registerDto, RolesEnum.ROLE_LP));
  }

  @Post('register/admin')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  registerAdmin(@Body() registerDto: UserRegisterDto): Promise<CreatedResponse> {
    return this.renderCreatedResponse(this.authService.register(registerDto, RolesEnum.ROLE_ADMIN));
  }

  @Get('/reset-password/hash/valid/:hash')
  checkHashValidity(@Param('hash') hash: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.authService.checkResetHashValidity(hash));
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.authService.resetPassword(resetPasswordDto));
  }

  @Get('activate/hash/:hash')
  activateAccountViaHash(@Param('hash') hash: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.authService.activateAccountViaHash(hash));
  }

  @Post('login/:admin?')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentialsDto: CredenialsDto, @Param('admin') admin: string,): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.authService.login(credentialsDto, !!admin));
  }
}
