import { IsNotEmpty, IsUUID } from "class-validator";

export class MsgWebSocketDto {
   
    @IsNotEmpty()
    @IsUUID("all")
    from : string;

    @IsNotEmpty()
    @IsUUID("all")
    to : string;

    @IsNotEmpty()
    @IsUUID("all")
    date: Date;

    @IsNotEmpty()
    @IsUUID("all")
    content: string;

    @IsNotEmpty()
    @IsUUID("all")
    ticket: string;
}