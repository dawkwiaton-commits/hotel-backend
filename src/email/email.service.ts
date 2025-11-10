import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch'; // jeśli Node 18+, możesz użyć wbudowanego fetch

import { SendEmailDto } from 'src/dto/send-email.dto';

@Injectable()
export class EmailService {
  private apiKey = process.env.BREVO_API_KEY!;
  private senderEmail = process.env.BREVO_SENDER_EMAIL!;
  private targetEmail = process.env.TARGET_EMAIL!;

  async sendReservationMail(dto: SendEmailDto) {
    const body = {
      sender: { email: this.senderEmail, name: 'Strona Rezerwacji' },
      to: [{ email: this.targetEmail, name: 'Strona Rezerwacji' }],
      subject: 'Nowa rezerwacja ze strony',
      htmlContent: `
        <h2>Nowa rezerwacja</h2>
        <p><strong>Imię i nazwisko:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Telefon:</strong> ${dto.phone}</p>
        <p><strong>Od:</strong> ${dto.dateFrom}</p>
        <p><strong>Do:</strong> ${dto.dateTo}</p>
        <p><strong>Wiadomość:</strong><br/>${dto.message || '-'}</p>
      `,
    };

    try {
      const res = await fetch('https://api.sendinblue.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Brevo API error:', text);
        throw new InternalServerErrorException('Nie udało się wysłać maila');
      }

      const data = await res.json();
      console.log('Email sent via Brevo API:', data);
      return { success: true };
    } catch (err) {
      console.error('Brevo API request failed', err);
      throw new InternalServerErrorException('Nie udało się wysłać maila');
    }
  }
}
