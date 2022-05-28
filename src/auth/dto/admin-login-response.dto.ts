import { RolesEnum } from "src/misc/enums/roles.enum";
import { LpData } from "src/user/entities/lp-data.entity";

export class AdminLoginResponeDto {
    accessToken: string;
    userData: {
        id: string;
        email: string;
        firstName: string; 
        lastName: string;
        dateOfBirth: Date;
        role: RolesEnum;
        isOnline: boolean;
        lpData: LpData;
        avatar: string;
        ability: [{action: string, subject: string}];
    }
}