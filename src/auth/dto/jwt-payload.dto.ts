import { RolesEnum } from 'src/misc/enums/roles.enum';

export interface JwtPayloadDto {
  roles: RolesEnum[];
  email: string;
}
