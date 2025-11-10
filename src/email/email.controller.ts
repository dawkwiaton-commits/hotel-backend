import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('reservation')
  async sendReservation(@Body() dto: any) {
    // 1. Verify reCAPTCHA
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${dto.captcha}`,
      { method: 'POST' }
    );

    const verify = await verifyRes.json();

    if (!verify.success || (verify.score && verify.score < 0.5)) {
      throw new BadRequestException('Captcha validation failed');
    }

    // 2. Remove captcha before sending email
    const { captcha, ...emailData } = dto;

    console.log("C", captcha)
    // 3. Send email
    return this.emailService.sendReservationMail(emailData);
  }
}
