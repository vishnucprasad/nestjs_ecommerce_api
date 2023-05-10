import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddtoCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addCart(userId: number, dto: AddtoCartDto) {
    let cart = await this.prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
        include: {
          products: true,
        },
      });
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: dto.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await this.prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        products: {
          connect: { id: product.id },
        },
      },
      include: {
        products: true,
      },
    });
  }
}
