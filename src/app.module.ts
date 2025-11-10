import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [BookingsModule, EmailModule],
})
export class AppModule {}
