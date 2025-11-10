import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://hotel-front-git-main-dawkwiaton-commits-projects.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Hotel API')
    .setDescription('API do obsługi rezerwacji i emaili')
    .setVersion('1.0')
    // .addBearerAuth() // jeśli masz auth JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // <- nowy port 3001
  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}
bootstrap();
