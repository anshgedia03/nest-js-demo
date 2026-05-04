import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ScoreUpdatedEvent } from './types/score-updated-event.type';

@Injectable()
export class ScoreConsumerService {
  private readonly leaderboardKey = 'leaderboard:scores';
  private readonly usersKey = 'leaderboard:users';

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async handleScoreUpdated(payload: ScoreUpdatedEvent) {
    const score = Number(payload.score);

    await this.redis
      .multi()
      .hset(this.usersKey, payload.userId, payload.userName)
      .zadd(this.leaderboardKey, score, payload.userId)
      .exec();

    return {
      success: true,
    };
  }

  async getLeaderboard(limit: number) {
    const sorted_users = await this.redis.zrevrange(this.leaderboardKey, 0, limit - 1, 'WITHSCORES');
    return {
      sorted_users,
    };
  }
}
