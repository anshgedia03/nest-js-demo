import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayloadType } from '../auth/types/jwt-payload.type';
import { Roles } from '../../common/decorators/roles.decorator';
import { ROLES } from '../../common/constants/roles.constant';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(ROLES.USER)
  create(@CurrentUser() user: JwtPayloadType) {
    return this.ordersService.create(user.sub);
  }

  @Get()
  @Roles(ROLES.USER)
  findMine(@CurrentUser() user: JwtPayloadType) {
    return this.ordersService.findOrdersByUser(user.sub);
  }

  @Get('admin/all')
  @Roles(ROLES.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles(ROLES.USER)
  findOne(@CurrentUser() user: JwtPayloadType, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.findOrderByUser(user.sub, id);
  }

  @Patch(':id/status')
  @Roles(ROLES.ADMIN)
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
