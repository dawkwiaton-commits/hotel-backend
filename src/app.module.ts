import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [BookingsModule], // <- tutaj moduł musi być zaimportowany
})
export class AppModule {}
