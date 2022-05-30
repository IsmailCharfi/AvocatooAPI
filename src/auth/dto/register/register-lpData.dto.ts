import { IsArray, IsNotEmpty } from "class-validator";

export class LpDataRegisterDto {
    @IsArray()
    expertise: string[];
}
  