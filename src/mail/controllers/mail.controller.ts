import { Body, Controller, Post } from "@nestjs/common";
import { ActivationDto } from "../dto/activation.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { MailService } from "../services/mail.service";
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post("/send/reset-password")
    sendResetPasswordMail(@Body() resetPasswordDto: ResetPasswordDto): any
    {
        const {email} = resetPasswordDto;
        return this.mailService.sendResetPasswordMail(email)
    }

    @Post("/send/activation")
    ReSendActivationMail(@Body() activationDto: ActivationDto): any
    {
        const {email} = activationDto;
        return this.mailService.sendActivationMail(email)
    }
}
