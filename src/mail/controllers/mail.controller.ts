import { Body, Controller, Post } from "@nestjs/common";
import { AbstractController, SuccessResponse } from "src/misc/abstracts/abstract.controller";
import { ActivationDto } from "../dto/activation.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { MailService } from "../services/mail.service";
@Controller('mail')
export class MailController extends AbstractController{
    constructor(private readonly mailService: MailService) {super()}

    @Post("/send/reset-password")
    sendResetPasswordMail(@Body() resetPasswordDto: ResetPasswordDto): Promise<SuccessResponse>
    {
        const {email} = resetPasswordDto;

        return this.renderSuccessResponse(
            this.mailService.sendResetPasswordMail(email),
            "email sent"
        ) 
    }

    @Post("/send/activation")
    ReSendActivationMail(@Body() activationDto: ActivationDto): Promise<SuccessResponse>
    {
        const {email} = activationDto;

        return this.renderSuccessResponse(
            this.mailService.sendActivationMail(email),
            "email sent"
        ) 
    }
}
