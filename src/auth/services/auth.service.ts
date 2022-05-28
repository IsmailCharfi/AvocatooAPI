import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { RegisterDto } from '../dto/register/register.dto';
import { UserService } from '../../user/services/user.service';
import { CredenialsDto } from '../dto/credenials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponeDto } from '../dto/login-respone.dto';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { AdminLoginResponeDto } from '../dto/admin-login-response.dto';
import { HashValidityDto } from '../dto/hash-validity.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { MailService } from 'src/mail/services/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto, role: RolesEnum): Promise<User> {
    const { email } = registerDto;
    let user = await this.userService.getUserByEmail(email);
    if (user) {
      throw new ConflictException('there is already a user with this email');
    }
    user = await this.userService.create(registerDto, role);
    user = await this.userService.createActivationHash(user);
    await this.mailService.sendActivationMail(user.email);
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
      throw new NotFoundException('Veuillez verifiez votre email');
    }

    if (!user.isActivated) {
      throw new ForbiddenException('Veuillez activer votre compte');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Veuillez verifiez votre email et mot de passe');
    }

    const payload: JwtPayloadDto = {
      email: user.email,
      role: user.role,
    };

    const jwt = this.jwtService.sign(payload);

    if (adminRoute) {
      if (user.role === RolesEnum.ROLE_ADMIN || user.role === RolesEnum.ROLE_DEV)
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
            role: user.role,
            ability: [{ action: '', subject: '' }],
            avatar: '',
          },
        };
      throw new ForbiddenException('Veuillez verifiez votre email et mot de passe');
    }

    return { jwt };
  }

  async checkResetHashValidity(hash: string): Promise<HashValidityDto> {
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
    const {password, hash} = resetPasswordDto;
    let user = await this.userService.getUserByResetPasswordHash(hash);
    if (!user)
      throw new ConflictException();
          
    user = await this.userService.resetPassword(user, password);
    delete user.password;
    delete user.salt;
    return user;
  }

  async activateAccountViaHash(hash: string): Promise<SuccessReturn> {
    hash = decodeURIComponent(hash)
    const user = await this.userService.getUserByActivationHash(hash);
    if (!user)
      throw new NotFoundException();
    
    this.userService.activate(user.id)

    return {}
  }
  
}
