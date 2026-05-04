import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ScoreConsumerModule } from './score_consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(ScoreConsumerModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE ?? 'leaderboard_score_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
