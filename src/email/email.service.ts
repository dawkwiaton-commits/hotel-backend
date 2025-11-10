import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { SendEmailDto } from 'src/dto/send-email.dto';

@Injectable()
export class EmailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async sendReservationMail(dto: SendEmailDto) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: process.env.TARGET_EMAIL! }];
    sendSmtpEmail.sender = { email: process.env.BREVO_SENDER_EMAIL!, name: 'Strona Rezerwacji' };
    sendSmtpEmail.subject = 'Nowa rezerwacja ze strony';
    sendSmtpEmail.htmlContent = `
      <h2>Nowa rezerwacja</h2>
      <p><strong>Imię i nazwisko:</strong> ${dto.name}</p>
      <p><strong>Email:</strong> ${dto.email}</p>
      <p><strong>Telefon:</strong> ${dto.phone}</p>
      <p><strong>Od:</strong> ${dto.dateFrom}</p>
      <p><strong>Do:</strong> ${dto.dateTo}</p>
      <p><strong>Wiadomość:</strong><br/>${dto.message || '-'}</p>
    `;

    try {
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email sent via Brevo API:', response);
      return { success: true };
    } catch (error) {
      console.error('Brevo API email sending failed', error);
      throw new InternalServerErrorException('Cannot send email via Brevo API');
    }
  }
}
