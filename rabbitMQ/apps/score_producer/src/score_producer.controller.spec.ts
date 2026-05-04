import { Test, TestingModule } from '@nestjs/testing';
import { ScoreProducerController } from './score_producer.controller';
import { ScoreProducerService } from './score_producer.service';

describe('ScoreProducerController', () => {
  let scoreProducerController: ScoreProducerController;
  let scoreProducerService: ScoreProducerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScoreProducerController],
      providers: [
        {
          provide: ScoreProducerService,
          useValue: {
            submitScore: jest.fn(),
          },
        },
      ],
    }).compile();

    scoreProducerController = app.get<ScoreProducerController>(ScoreProducerController);
    scoreProducerService = app.get<ScoreProducerService>(ScoreProducerService);
  });

  describe('submitScore', () => {
    it('should forward score updates to the service', async () => {
      const body = {
        userId: 'user-1',
        userName: 'Ansh',
        score: 250,
      };

      await scoreProducerController.submitScore(body);

      expect(scoreProducerService.submitScore).toHaveBeenCalledWith(body);
    });
  });
});
