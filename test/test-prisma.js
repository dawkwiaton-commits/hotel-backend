"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=test-prisma.js.map