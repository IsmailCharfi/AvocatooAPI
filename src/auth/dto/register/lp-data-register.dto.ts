import { IsArray, IsNotEmpty } from "class-validator";
import { Category } from "src/questions/entities/category.entity";

export class LpDataRegisterDto {

    @IsNotEmpty()
    image: string;

    @IsArray()
    expertise: string[];
}
  