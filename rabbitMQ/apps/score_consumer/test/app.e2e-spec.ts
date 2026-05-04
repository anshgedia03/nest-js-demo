import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ScoreConsumerModule } from './../src/score_consumer.module';
import { ScoreConsumerService } from './../src/score_consumer.service';

describe('ScoreConsumerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScoreConsumerModule],
    })
      .overrideProvider(ScoreConsumerService)
      .useValue({
        getLeaderboard: jest.fn().mockResolvedValue({
          total: 2,
          leaderboard: [
            {
              rank: 1,
              userId: 'user-2',
              userName: 'John',
              score: 300,
            },
            {
              rank: 2,
              userId: 'user-1',
              userName: 'Ansh',
              score: 250,
            },
          ],
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/leaderboard (GET)', () => {
    return request(app.getHttpServer())
      .get('/leaderboard?limit=2')
      .expect(200)
      .expect({
        total: 2,
        leaderboard: [
          {
            rank: 1,
            userId: 'user-2',
            userName: 'John',
            score: 300,
          },
          {
            rank: 2,
            userId: 'user-1',
            userName: 'Ansh',
            score: 250,
          },
        ],
      });
  });
});
