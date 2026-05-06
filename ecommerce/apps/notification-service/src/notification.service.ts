import { Injectable, Logger } from '@nestjs/common';
import { OrderCreatedEventType } from '@contracts/order-created-event.contract';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  logOrderCreated(event: OrderCreatedEventType): void {
    this.logger.log(
      `order_created received | userEmail=${event.userEmail} | orderId=${event.orderId} | totalAmount=${event.totalAmount}`,
    );
  }
}
