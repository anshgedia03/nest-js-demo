import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Injectable()
export class ScoreProducerService {
  constructor(
    @Inject('SCORE_EVENTS_CLIENT') private readonly client: ClientProxy,
  ) {}

  async submitScore(body: SubmitScoreDto) {
    this.validateScoreSubmission(body);

    const event = {
      userId: body.userId.trim(),
      userName: body.userName.trim(),
      score: Number(body.score),
      updatedAt: new Date().toISOString(),
    };

    await firstValueFrom(this.client.emit('score_updated', event));

    return {
      message: 'Score update accepted and published.',
      data: event,
    };
  }

  private validateScoreSubmission(body: SubmitScoreDto) {
    if (!body?.userId?.trim()) {
      throw new BadRequestException('userId is required');
    }

    if (!body?.userName?.trim()) {
      throw new BadRequestException('userName is required');
    }

    const numericScore = Number(body.score);
    if (!Number.isFinite(numericScore)) {
      throw new BadRequestException('score must be a valid number');
    }

    if (numericScore < 0) {
      throw new BadRequestException('score must be greater than or equal to 0');
    }
  }
}
