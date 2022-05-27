import { Body, Controller, Post } from "@nestjs/common";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { MailService } from "./mail.service";
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post("/send/reset-password")
    sendResetPasswordMail(@Body() resetPasswordDto: ResetPasswordDto): any
    {
        const {email} = resetPasswordDto;
        return this.mailService.sendResetPasswordMail(email)
    }
}
