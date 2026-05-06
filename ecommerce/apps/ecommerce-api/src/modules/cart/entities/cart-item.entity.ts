import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @ManyToOne(() => User, (user) => user.cartItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
