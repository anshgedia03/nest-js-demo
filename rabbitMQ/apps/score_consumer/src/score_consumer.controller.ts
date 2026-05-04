import { Controller, Get, Query } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ScoreConsumerService } from './score_consumer.service';
import type { ScoreUpdatedEvent } from './types/score-updated-event.type';

@Controller('leaderboard')
export class ScoreConsumerController {
  constructor(private readonly scoreConsumerService: ScoreConsumerService) {}

  @EventPattern('score_updated')
  async handleScoreUpdated(
    @Payload() payload:ScoreUpdatedEvent,
    @Ctx() context: RmqContext,
  ) {
    await this.scoreConsumerService.handleScoreUpdated(payload);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  @Get()
  getLeaderboard(@Query('limit') limit?: string) {
    const requestedLimit = Number(limit ?? '10');
    return this.scoreConsumerService.getLeaderboard(requestedLimit);
  }
}
