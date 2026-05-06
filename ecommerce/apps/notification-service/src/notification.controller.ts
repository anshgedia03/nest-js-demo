import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MICROSERVICE_CONSTANTS } from '@contracts/microservice.contract';
import { OrderCreatedEventType } from '@contracts/order-created-event.contract';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(MICROSERVICE_CONSTANTS.ORDER_CREATED_EVENT)
  handleOrderCreated(
    @Payload() payload: OrderCreatedEventType,
    @Ctx() context: RmqContext,
  ): void {
    // Acknowledge only after the notification workload succeeds.
    this.notificationService.logOrderCreated(payload);

    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
