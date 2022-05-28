import { Type } from "class-transformer";
import { IsAlphanumeric, IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, IsString } from "class-validator";
import { LpDataRegisterDto } from "./lp-data-register.dto";

export class RegisterDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsNumberString({length: 8})
  phoneNumber: string

  lpData?: LpDataRegisterDto
}
