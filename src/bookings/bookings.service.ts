import { Injectable } from '@nestjs/common';
import ical from 'ical-generator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BookingsService {
  async generateICal() {
    // Ustawiamy strefę czasową
    const cal = ical({ name: 'Hotel Bookings', timezone: 'Europe/Warsaw' });

    // Pobieramy wszystkie potwierdzone rezerwacje
    const bookings = await prisma.booking.findMany({
      where: { status: 'confirmed' }, // uwzględniamy wszystkie źródła, np. 'web'
    });

    bookings.forEach((b) => {
      // Poprawiamy endDate: dodajemy 1 dzień
      const startDate = new Date(b.startDate);
      const endDate = new Date(b.endDate);

      endDate.setDate(endDate.getDate() + 1);

      cal.createEvent({
        start: startDate,
        end: endDate,
        summary: `Zajęte - pokój ${b.roomId}`,
        description: b.guestName ? `Gość: ${b.guestName}` : undefined,
      });
    });

    return cal.toString();
  }
}
