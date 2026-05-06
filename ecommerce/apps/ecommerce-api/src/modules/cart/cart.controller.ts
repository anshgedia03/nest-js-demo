import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayloadType } from '../auth/types/jwt-payload.type';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { ROLES } from '../../common/constants/roles.constant';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles(ROLES.USER)
  getCart(@CurrentUser() user: JwtPayloadType) {
    return this.cartService.getCartByUserId(user.sub);
  }

  // JwtAuthGuard and RolesGuard are applied globally in AppModule.
  @Post()
  @Roles(ROLES.USER)
  addItem(
    @CurrentUser() user: JwtPayloadType,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    return this.cartService.addItem(user.sub, addCartItemDto);
  }

  @Patch(':itemId')
  @Roles(ROLES.USER)
  updateItem(
    @CurrentUser() user: JwtPayloadType,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.sub, itemId, updateCartItemDto);
  }

  @Delete(':itemId')
  @Roles(ROLES.USER)
  removeItem(
    @CurrentUser() user: JwtPayloadType,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
  ) {
    return this.cartService.removeItem(user.sub, itemId);
  }

  @Delete()
  @Roles(ROLES.USER)
  async clearCart(@CurrentUser() user: JwtPayloadType) {
    await this.cartService.clearCart(user.sub);
    return null;
  }
}
