import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../enums/roles.enum';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLE_KEY, roles);