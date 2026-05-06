import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../common/types/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
