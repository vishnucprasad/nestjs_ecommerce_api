import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductById(productId: number) {
    return await this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async getAllProducts() {
    return await this.prisma.product.findMany();
  }

  async addProduct(dto: AddProductDto) {
    return await this.prisma.product.create({
      data: dto,
    });
  }
}
