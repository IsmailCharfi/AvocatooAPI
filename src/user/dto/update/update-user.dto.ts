import { OmitType } from "@nestjs/mapped-types";
import { UserRegisterDto } from "src/auth/dto/register/register-user.dto";
import { UpdateLpDataDto } from "./update-lpData.dto";

export class UpdateUserDto extends OmitType(UserRegisterDto, ['lpData']) {
    lpData: UpdateLpDataDto
}
  