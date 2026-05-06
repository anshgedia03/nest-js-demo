import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MICROSERVICE_CONSTANTS } from '@contracts/microservice.contract';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from '../users/users.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_CONSTANTS.NOTIFICATION_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.getOrThrow<string>(
                MICROSERVICE_CONSTANTS.RABBITMQ_URL_CONFIG_PATH,
              ),
            ],
            queue: configService.getOrThrow<string>(
              MICROSERVICE_CONSTANTS.RABBITMQ_QUEUE_CONFIG_PATH,
            ),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    UsersModule,
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
