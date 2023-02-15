import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT } from '@environments';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@exceptions/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Nestjs Stripe')
    .setDescription('This is api learn nestjs and stripe')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT);
  console.log(
    `\nServer listening on: http://localhost:${APP_PORT}\nAPI docs: http://localhost:${APP_PORT}/docs`,
  );
}
bootstrap();
