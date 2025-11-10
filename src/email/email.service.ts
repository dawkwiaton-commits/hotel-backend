import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from 'src/dto/send-email.dto';

@Injectable()
export class EmailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;
  private transporter;

  constructor() {
    // Brevo API
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Nodemailer SMTP (Brevo)
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });
  }

  async sendReservationMail(dto: SendEmailDto) {
    const html = `
      <h2>Nowa rezerwacja</h2>
      <p><strong>Imię i nazwisko:</strong> ${dto.name}</p>
      <p><strong>Email:</strong> ${dto.email}</p>
      <p><strong>Telefon:</strong> ${dto.phone}</p>
      <p><strong>Od:</strong> ${dto.dateFrom}</p>
      <p><strong>Do:</strong> ${dto.dateTo}</p>
      <p><strong>Wiadomość:</strong><br/>${dto.message || '-'}</p>
    `;

    // --- 1. Spróbuj API Brevo ---
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.to = [{ email: process.env.TARGET_EMAIL! }];
      sendSmtpEmail.sender = { email: process.env.BREVO_SENDER_EMAIL!, name: 'Strona Rezerwacji' };
      sendSmtpEmail.subject = 'Nowa rezerwacja ze strony';
      sendSmtpEmail.htmlContent = html;

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email sent via Brevo API:', response);
      return { success: true, method: 'Brevo API' };
    } catch (apiError) {
      console.warn('Brevo API failed, trying SMTP...', apiError);
    }

    // --- 2. Fallback SMTP ---
    try {
      await this.transporter.sendMail({
        from: `"Strona Rezerwacji" <${process.env.BREVO_SMTP_USER}>`,
        to: process.env.TARGET_EMAIL,
        subject: 'Nowa rezerwacja ze strony',
        html,
      });
      console.log('Email sent via Brevo SMTP');
      return { success: true, method: 'Brevo SMTP' };
    } catch (smtpError) {
      console.error('Email sending failed via SMTP', smtpError);
      throw new InternalServerErrorException('Cannot send email via Brevo API or SMTP');
    }
  }
}
