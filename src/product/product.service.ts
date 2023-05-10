import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddProductDto, EditProductDto } from './dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductById(productId: number): Promise<Product> {
    return await this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async getProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async addProduct(dto: AddProductDto): Promise<Product> {
    return await this.prisma.product.create({
      data: dto,
    });
  }

  async editProductById(
    productId: number,
    dto: EditProductDto,
  ): Promise<Product> {
    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProductById(productId: number): Promise<Product> {
    return await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
