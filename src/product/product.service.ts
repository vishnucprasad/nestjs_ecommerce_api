import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddProductDto, EditProductDto } from './dto';

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

  async editProductById(productId: number, dto: EditProductDto) {
    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProductById(productId: number) {
    return await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
