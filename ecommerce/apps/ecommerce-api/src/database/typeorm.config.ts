import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Category } from '../modules/categories/entities/category.entity';
import { CartItem } from '../modules/cart/entities/cart-item.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { OrderItem } from '../modules/orders/entities/order-item.entity';
import { Product } from '../modules/products/entities/product.entity';
import { User } from '../modules/users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'ztlab104',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'ecommerce',
  entities: [User, Category, Product, CartItem, Order, OrderItem],
  migrations: ['apps/ecommerce-api/src/database/migrations/*.ts'],
  synchronize: false,
});
