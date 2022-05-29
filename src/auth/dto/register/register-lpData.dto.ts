import { IsArray, IsNotEmpty } from "class-validator";

export class LpDataRegisterDto {

    @IsNotEmpty()
    image: string;

    @IsArray()
    expertise: string[];
}
  