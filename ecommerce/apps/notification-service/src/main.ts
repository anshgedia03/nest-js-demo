import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationServiceAppModule } from './app.module';

async function bootstrapNotificationService(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: process.env.RABBITMQ_QUEUE ?? 'order_notifications',
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );

  const logger = new Logger('NotificationService');
  const queue = process.env.RABBITMQ_QUEUE ?? 'order_notifications';

  await app.listen();
  logger.log(`Notification service is listening on RabbitMQ queue "${queue}"`);
}

void bootstrapNotificationService();
