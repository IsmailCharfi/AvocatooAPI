import { RolesEnum } from "src/misc/enums/roles.enum";
import { ExportLpDataSimpleDto } from "./export-lpData-simple.dto";

export class ExportUserSimpleDto {
    id: string
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    phoneNumber: string;
    role: RolesEnum;
    isActivated: boolean;
    isOnline: boolean;
    lpData: ExportLpDataSimpleDto   
}