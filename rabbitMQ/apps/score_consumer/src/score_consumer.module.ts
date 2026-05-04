import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ScoreConsumerController } from './score_consumer.controller';
import { ScoreConsumerService } from './score_consumer.service';

@Module({
  imports: [],
  controllers: [ScoreConsumerController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () =>
        new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379'),
    },
    ScoreConsumerService,
  ],
})
export class ScoreConsumerModule {}
