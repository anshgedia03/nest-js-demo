import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EmailConsumerModule } from './email_consumer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailConsumerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: process.env.RABBITMQ_QUEUE ?? 'user_login_queue',
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );

  await app.listen();
}
bootstrap();
