import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto } from '../dto/register/register-user.dto';
import { CredenialsDto } from '../dto/credenials.dto';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AbstractController, CreatedResponse, SuccessResponse } from 'src/misc/abstracts/abstract.controller';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { LpImageConfig } from 'src/misc/multer-config/lp-image.config';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { ParseFormDataJsonPipe } from 'src/misc/pipes/parse-form-data.pipe';

@Controller('auth')
export class AuthController extends AbstractController{
  constructor(private readonly authService: AuthService) {super()}

  @Post('register/client')
  registerClient(@Body() registerDto: UserRegisterDto): Promise<CreatedResponse> {
    return this.renderCreatedResponse(this.authService.register(registerDto, RolesEnum.ROLE_CLIENT));
  }

  @Post('register/lp')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('imageFile', LpImageConfig))
  registerLp(@Body(new ParseFormDataJsonPipe({ except: ['imageFile'] })) registerDto: UserRegisterDto, @UploadedFile() file: Express.Multer.File): Promise<CreatedResponse> {
    console.log(registerDto, file)
    return this.renderCreatedResponse(this.authService.register(registerDto, RolesEnum.ROLE_LP, file));
  }

  @Post('register/admin')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
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

  @Post('activate/hash/:hash')
  activateAccountViaHash(@Param('hash') hash: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.authService.activateAccountViaHash(hash));
  }

  @Post('login/:admin?')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentialsDto: CredenialsDto, @Param('admin') admin: string,): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.authService.login(credentialsDto, !!admin));
  }

  @Post("/logout/:id")
  @HttpCode(HttpStatus.OK)
  logout(@Param("id") id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.authService.logout(id));
  }
}
