import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScoreProducerController } from './score_producer.controller';
import { ScoreProducerService } from './score_producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCORE_EVENTS_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE ?? 'leaderboard_score_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [ScoreProducerController],
  providers: [ScoreProducerService],
})
export class ScoreProducerModule {}
