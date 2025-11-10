import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // TLS w Brevo na 587 nie wymaga secure
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendReservationMail(data: {
    name: string;
    email: string;
    phone: string;
    dateFrom: string;
    dateTo: string;
    message?: string;
  }) {
    try {
      const html = `
        <h2>Nowa rezerwacja</h2>
        <p><strong>Imię i nazwisko:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Od:</strong> ${data.dateFrom}</p>
        <p><strong>Do:</strong> ${data.dateTo}</p>
        <p><strong>Wiadomość:</strong><br/>${data.message || '-'}</p>
      `;

      await this.transporter.sendMail({
        from: `"Strona Rezerwacji" <${process.env.SMTP_USER}>`,
        to: process.env.TARGET_EMAIL,
        subject: 'Nowa rezerwacja ze strony',
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Email sending failed', error);
      throw new InternalServerErrorException('Cannot send email');
    }
  }
}
