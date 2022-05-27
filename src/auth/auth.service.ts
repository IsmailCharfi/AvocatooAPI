import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../users/user.service';
import { CredenialsDto } from './dto/credenials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponeDto } from './dto/login-respone.dto';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { AdminLoginResponeDto } from './dto/admin-login-response.dto';
import { HashValidityDto } from './dto/hash-validity.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, role: RolesEnum): Promise<User> {
    const { email } = registerDto;
    let user = await this.userService.getUserByEmail(email);
    if (user) {
      throw new ConflictException('there is already a user with this email');
    }
    user = await this.userService.create(registerDto, role);
    delete user.password;
    delete user.salt;
    return user;
  }

  async login(
    credentialsDto: CredenialsDto,
    adminRoute: boolean,
  ): Promise<LoginResponeDto | AdminLoginResponeDto> {
    const { email, password } = credentialsDto;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('There is no user with this email');
    }

    if (!user.isActivated) {
      throw new UnauthorizedException('Veuillez activer votre compte');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Check your password');
    }

    const payload: JwtPayloadDto = {
      email: user.email,
      roles: user.roles,
    };

    const jwt = this.jwtService.sign(payload);

    if (adminRoute) {
      if (user.roles.includes(RolesEnum.ROLE_ADMIN) || user.roles.includes(RolesEnum.ROLE_DEV))
        return {
          accessToken: jwt,
          userData: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            isOnline: user.isOnline,
            lpData: user.lpData,
            roles: user.roles,
            userName: user.userName,
            ability: [{ action: '', subject: '' }],
            avatar: '',
          },
        };
      throw new UnauthorizedException('Check your credentials');
    }

    return { jwt };
  }

  async checkHashValidity(hash: string): Promise<HashValidityDto> {
    hash = decodeURIComponent(hash)
    const user = await this.userService.getUserByResetPasswordHash(hash);
    if (!user)
      return {isValid: false}

    const timediff = (new Date().valueOf() - user.resetPasswordSentAt.valueOf()) / (3600 * 1000);
    const isValid =  timediff < 1 && timediff > 0;
    if(isValid) return {isValid, id: user.id}
    return {isValid: false}
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const {id, password, hash} = resetPasswordDto;
    let user = await this.userService.getUserById(id);
    if (!user)
      throw new ConflictException();
    const isValid = hash === user.resetPasswordHash;

    if(!isValid)
      throw new UnauthorizedException();
    
    user = await this.userService.resetPassword(user, password);
    delete user.password;
    delete user.salt;
    return user;
  }
  
}
