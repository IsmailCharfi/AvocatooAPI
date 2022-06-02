import { RolesEnum } from 'src/misc/enums/roles.enum';

export class JwtPayloadDto {
  role: RolesEnum;
  email: string;
  id:string;
}
