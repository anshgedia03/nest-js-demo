import { Test, TestingModule } from '@nestjs/testing';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';

describe('RiderController', () => {
  let riderController: RiderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RiderController],
      providers: [
        {
          provide: RiderService,
          useValue: {
            getRiderById: jest.fn(),
          },
        },
      ],
    }).compile();

    riderController = app.get<RiderController>(RiderController);
  });

  it('should be defined', () => {
    expect(riderController).toBeDefined();
  });
});
