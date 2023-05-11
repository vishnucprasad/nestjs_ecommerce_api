import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus } from '@prisma/client';
import { OrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(userId: number): Promise<Order[]> {
    return await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });
  }

  async checkout(userId: number, dto: OrderDto): Promise<Order> {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });

    if (!cart || cart.products.length === 0) {
      throw new ForbiddenException('Cart is empty');
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId: dto.addressId,
        orderStatus: OrderStatus.PLACED,
        products: {
          connect: cart.products.map((product) => ({ id: product.id })),
        },
      },
      include: {
        products: true,
      },
    });

    await this.prisma.cart.update({
      where: {
        userId,
      },
      data: {
        products: {
          disconnect: order.products.map((product) => ({ id: product.id })),
        },
      },
    });

    return order;
  }
}
