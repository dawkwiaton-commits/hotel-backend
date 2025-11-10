import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://hotel-front-git-main-dawkwiaton-commits-projects.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // <- nowy port 3001
  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}
bootstrap();
