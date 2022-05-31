import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import * as dotenv from 'dotenv';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
dotenv.config();

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: any,): Promise<any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];

    try {
      const payload = this.jwtService.verify(bearerToken, {
        secret: process.env.SECRET,
      }) as JwtPayloadDto;

        const user = await this.userService.getUserByEmail(payload.email);
        if (!user) {
          return false
        }
        return true;
      } catch (error) {
      console.log(error);
      return false;
    }
  }
}
