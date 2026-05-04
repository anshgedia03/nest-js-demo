import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ScoreProducerModule } from './../src/score_producer.module';
import { ScoreProducerService } from './../src/score_producer.service';

describe('ScoreProducerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScoreProducerModule],
    })
      .overrideProvider(ScoreProducerService)
      .useValue({
        submitScore: jest.fn().mockResolvedValue({
          message: 'Score update accepted and published.',
          data: {
            userId: 'user-1',
            userName: 'Ansh',
            score: 250,
            updatedAt: '2026-05-04T00:00:00.000Z',
          },
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/leaderboard/score (POST)', () => {
    return request(app.getHttpServer())
      .post('/leaderboard/score')
      .send({
        userId: 'user-1',
        userName: 'Ansh',
        score: 250,
      })
      .expect(201)
      .expect({
        message: 'Score update accepted and published.',
        data: {
          userId: 'user-1',
          userName: 'Ansh',
          score: 250,
          updatedAt: '2026-05-04T00:00:00.000Z',
        },
      });
  });
});
