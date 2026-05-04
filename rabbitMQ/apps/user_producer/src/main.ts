import { NestFactory } from '@nestjs/core';
import { UserProducerModule } from './user_producer.module';

async function bootstrap() {
  const app = await NestFactory.create(UserProducerModule);
  await app.listen(process.env.port ?? 4000);
}
bootstrap();
