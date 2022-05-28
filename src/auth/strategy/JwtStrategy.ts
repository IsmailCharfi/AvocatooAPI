import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { UserService } from '../../user/services/user.service';
import * as dotenv from 'dotenv'

dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    });
  }
  async validate(payload: JwtPayloadDto) {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Veuillez vérifier vos credentials');
    }
    return user;
  }
}
