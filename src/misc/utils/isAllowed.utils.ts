import { User } from "src/user/entities/user.entity";
import { RolesEnum } from "../enums/roles.enum";

export const isAllowed = (user: User, role?: RolesEnum) => {

    if(role && user.role === role)
        return true

    return user.role === RolesEnum.ROLE_ADMIN || user.role === RolesEnum.ROLE_DEV
}