import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      logger: true,
      debug: true,
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
    const html = `
      <h2>Nowa rezerwacja</h2>
      <p><strong>Imię i nazwisko:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>Od:</strong> ${data.dateFrom}</p>
      <p><strong>Do:</strong> ${data.dateTo}</p>
      <p><strong>Wiadomość:</strong><br/>${data.message || '-'}</p>
    `;

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('SMTP ready:', success);
      }
    });

    console.log("GMAIL U", process.env.GMAIL_USER)

    console.log("GMAIL P", process.env.GMAIL_PASS)

    try {
      const info = await this.transporter.sendMail({
        from: `"Strona Rezerwacji" <${process.env.GMAIL_USER}>`,
        to: data.email, // tutaj możesz też użyć stałego adresu np. TARGET_EMAIL
        subject: 'Nowa rezerwacja ze strony',
        html,
      });

      console.log('Mail wysłany:', info.messageId);
      return { success: true };
    } catch (error) {
      console.error('Email wysyłka nie powiodła się', error);
      throw new InternalServerErrorException('Nie udało się wysłać maila');
    }
  }
}
