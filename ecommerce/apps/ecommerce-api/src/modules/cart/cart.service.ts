import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async getCartByUserId(userId: string): Promise<CartItem[]> {
    return this.cartItemsRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private async findCartItemByUser(userId: string, itemId: string): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: {
        id: itemId,
        user: { id: userId },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return cartItem;
  }

  async addItem(userId: string, addCartItemDto: AddCartItemDto): Promise<CartItem[]> {
    const user = await this.usersService.findById(userId);
    const cartItems = await this.getCartByUserId(userId);
    const product = await this.productsService.findById(addCartItemDto.productId);
    const currentQuantity =
      cartItems.find((item) => item.product.id === product.id)?.quantity ?? 0;
    const requestedQuantity = currentQuantity + addCartItemDto.quantity;

    if (requestedQuantity > product.stock) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += addCartItemDto.quantity;
      await this.cartItemsRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemsRepository.create({
        user,
        product,
        quantity: addCartItemDto.quantity,
      });

      await this.cartItemsRepository.save(cartItem);
    }

    return this.getCartByUserId(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem[]> {
    const cartItem = await this.findCartItemByUser(userId, itemId);

    if (updateCartItemDto.quantity > cartItem.product.stock) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    await this.cartItemsRepository.save(cartItem);

    return this.getCartByUserId(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<CartItem[]> {
    const item = await this.findCartItemByUser(userId, itemId);

    await this.cartItemsRepository.remove(item);

    return this.getCartByUserId(userId);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemsRepository.delete({
      user: { id: userId },
    });
  }
}
