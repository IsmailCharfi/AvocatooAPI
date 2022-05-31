import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { LpDataRegisterDto } from "./register-lpData.dto";

export class UserRegisterDto {

  email: string;

  password: string;
  
  firstName: string;

  lastName: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @IsNumberString({length: 8})
  @IsOptional()
  phoneNumber: string

  lpData?: LpDataRegisterDto
}
