import { Test, TestingModule } from '@nestjs/testing';
import { UserProducerController } from './user_producer.controller';
import { UserProducerService } from './user_producer.service';

describe('UserProducerController', () => {
  let userProducerController: UserProducerController;
  let userProducerService: UserProducerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserProducerController],
      providers: [
        {
          provide: UserProducerService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    userProducerController = app.get<UserProducerController>(UserProducerController);
    userProducerService = app.get<UserProducerService>(UserProducerService);
  });

  describe('login', () => {
    it('should call the service login method', async () => {
      const body = {
        email: 'anshgedia03@gmail.com',
        password: '123456',
      };

      await userProducerController.login(body);

      expect(userProducerService.login).toHaveBeenCalledWith(body);
    });
  });
});
