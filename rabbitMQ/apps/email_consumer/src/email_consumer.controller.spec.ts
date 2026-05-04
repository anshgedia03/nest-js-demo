import { Test, TestingModule } from '@nestjs/testing';
import { EmailConsumerController } from './email_consumer.controller';
import { EmailConsumerService } from './email_consumer.service';

describe('EmailConsumerController', () => {
  let emailConsumerController: EmailConsumerController;
  let emailConsumerService: EmailConsumerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailConsumerController],
      providers: [
        {
          provide: EmailConsumerService,
          useValue: {
            sendWelcomeEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    emailConsumerController = app.get<EmailConsumerController>(EmailConsumerController);
    emailConsumerService = app.get<EmailConsumerService>(EmailConsumerService);
  });

  describe('handleUserLoggedIn', () => {
    it('should pass the payload to the service and ack the message', async () => {
      const ack = jest.fn();
      const payload = {
        name: 'ansh gedia',
        email: 'anshgedia03@gmail.com',
        loggedInAt: new Date().toISOString(),
      };
      const context = {
        getChannelRef: () => ({ ack }),
        getMessage: () => 'message',
      } as any;

      await emailConsumerController.handleUserLoggedIn(payload, context);

      expect(emailConsumerService.sendWelcomeEmail).toHaveBeenCalledWith(payload);
      expect(ack).toHaveBeenCalledWith('message');
    });
  });
});
