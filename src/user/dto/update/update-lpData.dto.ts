import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsUUID } from "class-validator";
import { LpDataRegisterDto } from "src/auth/dto/register/register-lpData.dto";

export class UpdateLpDataDto extends PartialType(LpDataRegisterDto) {
    
    @IsUUID('all')
    @IsNotEmpty()
    id: string
}
  