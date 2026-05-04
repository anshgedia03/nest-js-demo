import { Body, Controller, Post } from '@nestjs/common';
import { ScoreProducerService } from './score_producer.service';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Controller('leaderboard')
export class ScoreProducerController {
  constructor(private readonly scoreProducerService: ScoreProducerService) {}

  @Post('score')
  submitScore(@Body() body: SubmitScoreDto) {
    return this.scoreProducerService.submitScore(body);
  }
}
