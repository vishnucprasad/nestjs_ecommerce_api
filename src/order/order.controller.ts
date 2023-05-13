import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { AccessGuard } from '../auth/guard';
import { OrderService } from './order.service';
import { Order } from '@prisma/client';
import { OrderDto } from './dto';

@UseGuards(AccessGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(@GetUser('id') userId: number): Promise<Order[]> {
    return this.orderService.getOrders(userId);
  }

  @Post()
  checkout(
    @GetUser('id') userId: number,
    @Body() dto: OrderDto,
  ): Promise<Order> {
    return this.orderService.checkout(userId, dto);
  }
}
