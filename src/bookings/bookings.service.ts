import { Injectable } from '@nestjs/common';
import ical from 'ical-generator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BookingsService {
  async generateICal() {
    const cal = ical({ name: 'Hotel Bookings' });

    const bookings = await prisma.booking.findMany({
      where: { source: 'local', status: 'confirmed' },
    });

    bookings.forEach(b => {
      cal.createEvent({
        start: b.startDate,
        end: b.endDate,
        summary: `Zajęte - pokój ${b.roomId}`,
        description: b.guestName ? `Gość: ${b.guestName}` : undefined,
      });
    });

    return cal.toString();
  }
}
