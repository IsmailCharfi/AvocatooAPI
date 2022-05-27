import { RolesEnum } from 'src/misc/enums/roles.enum';

export class JwtPayloadDto {
  roles: RolesEnum[];
  email: string;
}
