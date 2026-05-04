import { Test, TestingModule } from '@nestjs/testing';
import { ScoreConsumerController } from './score_consumer.controller';
import { ScoreConsumerService } from './score_consumer.service';

describe('ScoreConsumerController', () => {
  let scoreConsumerController: ScoreConsumerController;
  let scoreConsumerService: ScoreConsumerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScoreConsumerController],
      providers: [
        {
          provide: ScoreConsumerService,
          useValue: {
            handleScoreUpdated: jest.fn(),
            getLeaderboard: jest.fn(),
          },
        },
      ],
    }).compile();

    scoreConsumerController = app.get<ScoreConsumerController>(ScoreConsumerController);
    scoreConsumerService = app.get<ScoreConsumerService>(ScoreConsumerService);
  });

  describe('handleScoreUpdated', () => {
    it('should persist the event and ack the message', async () => {
      const ack = jest.fn();
      const payload = {
        userId: 'user-1',
        userName: 'Ansh',
        score: 250,
        updatedAt: new Date().toISOString(),
      };
      const context = {
        getChannelRef: () => ({ ack }),
        getMessage: () => 'message',
      } as any;

      await scoreConsumerController.handleScoreUpdated(payload, context);

      expect(scoreConsumerService.handleScoreUpdated).toHaveBeenCalledWith(
        payload,
      );
      expect(ack).toHaveBeenCalledWith('message');
    });
  });

  describe('getLeaderboard', () => {
    it('should request leaderboard data from the service', async () => {
      await scoreConsumerController.getLeaderboard('5');

      expect(scoreConsumerService.getLeaderboard).toHaveBeenCalledWith(5);
    });
  });
});
