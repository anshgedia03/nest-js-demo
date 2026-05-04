import { NestFactory } from '@nestjs/core';
import { ScoreProducerModule } from './score_producer.module';

async function bootstrap() {
  const app = await NestFactory.create(ScoreProducerModule);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
