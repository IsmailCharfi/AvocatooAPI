import { RolesEnum } from "src/misc/enums/roles.enum";

export interface LoginAdminResponeDto {
    accessToken: string;
    userData: {id: string
    fullName: string;
    username: string;
    avatar: string;
    email: string;
    ability: [{action: string, subject:string}]
    roles: RolesEnum[]
    }
}