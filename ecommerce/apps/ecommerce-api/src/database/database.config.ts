import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DATABASE_CONSTANTS } from '../common/constants/database.constant';
import { Category } from '../modules/categories/entities/category.entity';
import { CartItem } from '../modules/cart/entities/cart-item.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { OrderItem } from '../modules/orders/entities/order-item.entity';
import { Product } from '../modules/products/entities/product.entity';
import { User } from '../modules/users/entities/user.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: DATABASE_CONSTANTS.TYPE,
    host: configService.getOrThrow<string>(DATABASE_CONSTANTS.HOST_KEY),
    port: configService.getOrThrow<number>(DATABASE_CONSTANTS.PORT_KEY),
    username: configService.getOrThrow<string>(DATABASE_CONSTANTS.USERNAME_KEY),
    password: configService.getOrThrow<string>(DATABASE_CONSTANTS.PASSWORD_KEY),
    database: configService.getOrThrow<string>(DATABASE_CONSTANTS.NAME_KEY),
    entities: [User, Category, Product, CartItem, Order, OrderItem],
    synchronize: configService.get<boolean>(DATABASE_CONSTANTS.SYNC_KEY, false),
    logging: configService.get<boolean>(DATABASE_CONSTANTS.LOGGING_KEY, false),
    autoLoadEntities: false,
  }),
};
