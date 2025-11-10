// email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'dawidkwiaton123@gmail.com', // Twój Gmail
        pass: 'snjiqqasrvvduert',   // App Password wygenerowane w Gmail
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
    const html = `
      <h2>Nowa rezerwacja</h2>
      <p><strong>Imię i nazwisko:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>Od:</strong> ${data.dateFrom}</p>
      <p><strong>Do:</strong> ${data.dateTo}</p>
      <p><strong>Wiadomość:</strong><br/>${data.message || '-'}</p>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: '"Strona Rezerwacji" <dawidkwiaton123@gmail.com>', // Twój Gmail
        to: data.email, // Kto ma dostać maila
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
