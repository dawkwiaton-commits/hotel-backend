import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const bookings = await prisma.booking.findMany();
  console.log(bookings);
}

test()
  .then(() => {
    console.log('Test zakończony');
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
