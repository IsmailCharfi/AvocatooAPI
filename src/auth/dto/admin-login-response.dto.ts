import { RolesEnum } from "src/misc/enums/roles.enum";
import { LpData } from "src/users/entities/lp-data.entity";

export class AdminLoginResponeDto {
    accessToken: string;
    userData: {
        id: string;
        email: string;
        firstName: string; 
        lastName: string;
        userName: string;
        dateOfBirth: Date;
        roles: RolesEnum[];
        isOnline: boolean;
        lpData: LpData;
        avatar: string;
        ability: [{action: string, subject: string}];
    }
}