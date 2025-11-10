import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class EmailService {
  private mailerSend: MailerSend;

  constructor() {
    this.mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY!,
    });
  }

  async sendReservationMail(dto: {
    name: string;
    email: string;
    phone: string;
    dateFrom: string;
    dateTo: string;
    message?: string;
  }) {
    const sender = new Sender(
      'MS_tzwct7@test-r83ql3pq1dzgzw1j.mlsender.net', 
      'Strona Rezerwacji'
    );
    const recipient = new Recipient(process.env.TARGET_EMAIL!, 'Odbiorca');

    const html = `
      <h2>Nowa rezerwacja</h2>
      <p><strong>Imię i nazwisko:</strong> ${dto.name}</p>
      <p><strong>Email:</strong> ${dto.email}</p>
      <p><strong>Telefon:</strong> ${dto.phone}</p>
      <p><strong>Od:</strong> ${dto.dateFrom}</p>
      <p><strong>Do:</strong> ${dto.dateTo}</p>
      <p><strong>Wiadomość:</strong><br/>${dto.message || '-'}</p>
    `;

    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo([recipient])
      .setSubject('Nowa rezerwacja ze strony')
      .setHtml(html)
      .setText(`Nowa rezerwacja od ${dto.name}`);

    try {
      const response = await this.mailerSend.email.send(emailParams);
      console.log('Email wysłany przez MailerSend:', response);
      return { success: true };
    } catch (error) {
      console.error('MailerSend wysyłka nie powiodła się', error);
      throw new InternalServerErrorException('Nie udało się wysłać maila');
    }
  }
}
