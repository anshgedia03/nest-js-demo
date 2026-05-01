import { NestFactory } from '@nestjs/core';
import { LoggingModule } from './logging.module';

async function bootstrap() {
  const app = await NestFactory.create(LoggingModule);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
