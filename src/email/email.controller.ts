import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from 'src/dto/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('reservation')
  sendReservation(@Body() dto: SendEmailDto) {
    return this.emailService.sendReservationMail(dto);
  }
}
