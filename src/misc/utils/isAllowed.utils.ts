import { User } from "src/user/entities/user.entity";
import { RolesEnum } from "../enums/roles.enum";

export const isAllowed = (user: User, ...roles: RolesEnum[]) => {

    if(roles && roles.includes(user.role) )
        return true

    return user.role === RolesEnum.ROLE_ADMIN || user.role === RolesEnum.ROLE_DEV
}