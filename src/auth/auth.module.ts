import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/JwtStrategy';
import * as dotenv from 'dotenv'
import { MailService } from 'src/mail/services/mail.service';
import { MailModule } from 'src/mail/mail.module';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService,],
  exports: [AuthService],
  imports: [
    forwardRef(() => UserModule),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: "30d" },
    }),
  ],
})
export class AuthModule {}
