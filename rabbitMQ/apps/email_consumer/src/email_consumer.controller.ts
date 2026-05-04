import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EmailConsumerService } from './email_consumer.service';

interface UserLoggedInEvent {
  name: string;
  email: string;
  loggedInAt: string;
}

@Controller()
export class EmailConsumerController {
  constructor(private readonly emailConsumerService: EmailConsumerService) {}

  @EventPattern('user.logged_in')
  async handleUserLoggedIn(
    @Payload() payload: UserLoggedInEvent,
    @Ctx() context: RmqContext,
  ) {
    await this.emailConsumerService.sendWelcomeEmail(payload);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
