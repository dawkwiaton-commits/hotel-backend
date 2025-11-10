import { Controller, Get, Res } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import type { Response } from 'express';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('ical')
  async getICal(@Res() res: Response) {
    const icalString = await this.bookingsService.generateICal();
    res.setHeader('Content-Type', 'text/calendar');
    res.send(icalString);
  }
}
