import { Inject, Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { MICROSERVICE_CONSTANTS } from '@contracts/microservice.contract';
import { OrderCreatedEventType } from '@contracts/order-created-event.contract';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from '../../common/types/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @Inject(MICROSERVICE_CONSTANTS.NOTIFICATION_CLIENT)
    private readonly notificationClient: ClientProxy,
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly cartService: CartService,
  ) {}

  private readonly orderRelations = {
    user: true,
    items: {
      product: {
        category: true,
      },
    },
  } as const;

  async create(userId: string): Promise<Order> {
    const user = await this.usersService.findById(userId);
    const cartItems = await this.cartService.getCartByUserId(userId);

    if (!cartItems.length) {
      throw new BadRequestException('Cannot create an order from an empty cart');
    }

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Insufficient stock for product ${item.product.title}`,
        );
      }
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const savedOrder = await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const productRepository = manager.getRepository(Product);
      const cartItemRepository = manager.getRepository(CartItem);

      const order = orderRepository.create({
        user,
        status: OrderStatus.PENDING,
        totalAmount,
        items: cartItems.map((item) =>
          this.orderItemsRepository.create({
            product: item.product,
            quantity: item.quantity,
            price: item.product.price,
          }),
        ),
      });

      const persistedOrder = await orderRepository.save(order);

      for (const item of cartItems) {
        await productRepository.decrement({ id: item.product.id }, 'stock', item.quantity);
      }

      await cartItemRepository.delete({
        user: { id: userId },
      });

      return persistedOrder;
    });

    const completedOrder = await this.ordersRepository.findOneOrFail({
      where: { id: savedOrder.id },
      relations: this.orderRelations,
    });

    await this.emitOrderCreatedEvent({
      orderId: completedOrder.id,
      userEmail: completedOrder.user.email,
      totalAmount: Number(completedOrder.totalAmount),
    });

    return completedOrder;
  }

  async findOrdersByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: this.orderRelations,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOrderByUser(userId: string, orderId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {
        id: orderId,
        user: { id: userId },
      },
      relations: this.orderRelations,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: this.orderRelations,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: this.orderRelations,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderStatusDto.status;
    return this.ordersRepository.save(order);
  }

  private async emitOrderCreatedEvent(
    payload: OrderCreatedEventType,
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.notificationClient.emit(
          MICROSERVICE_CONSTANTS.ORDER_CREATED_EVENT,
          payload,
        ),
      );
    } catch (error) {
      // Production systems typically move this into an outbox/retry pipeline.
      this.logger.error(
        `Failed to emit ${MICROSERVICE_CONSTANTS.ORDER_CREATED_EVENT} for order ${payload.orderId}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
