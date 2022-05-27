import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/JwtStrategy';
import * as dotenv from 'dotenv'
import { MailService } from 'src/mail/mail.service';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService,],
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: 3600 },
    }),
  ],
})
export class AuthModule {}
