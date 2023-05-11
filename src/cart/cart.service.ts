import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: number) {
    return await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });
  }

  async addCart(userId: number, dto: CartDto) {
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

  async removeFromCart(userId: number, dto: CartDto) {
    let cart = await this.prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });

    if (!cart) {
      throw new ForbiddenException('Access denied');
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
          disconnect: { id: product.id },
        },
      },
      include: {
        products: true,
      },
    });
  }
}
