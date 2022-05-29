import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { LpDataRegisterDto } from "./register-lpData.dto";

export class UserRegisterDto {

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
