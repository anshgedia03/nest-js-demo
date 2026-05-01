import { Test, TestingModule } from '@nestjs/testing';
import { LoggingController } from './logging.controller';
import { LoggingService } from './logging.service';

describe('LoggingController', () => {
  let loggingController: LoggingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoggingController],
      providers: [
        {
          provide: LoggingService,
          useValue: {
            createRider: jest.fn(),
            getRiderById: jest.fn(),
          },
        },
      ],
    }).compile();

    loggingController = app.get<LoggingController>(LoggingController);
  });

  it('should be defined', () => {
    expect(loggingController).toBeDefined();
  });
});
