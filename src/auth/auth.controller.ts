import { Body, Controller, Param, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { CredenialsDto } from "./dto/credenials.dto";
import { LoginResponeDto } from "./dto/login-respone.dto";
import { LoginAdminResponeDto } from "./dto/admin-login-response.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    console.log("register")
    return this.authService.register(registerDto);
  }
  @Post('login/:admin?')
  login(@Body() credentialsDto: CredenialsDto, @Param("admin")admin: string): Promise<LoginResponeDto | LoginAdminResponeDto> {
    console.log(admin)
    return this.authService.login(credentialsDto, !!admin);
  }
}
