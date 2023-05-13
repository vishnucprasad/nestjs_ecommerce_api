import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../auth/guard';
import { AddProductDto, EditProductDto } from './dto';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@UseGuards(AccessGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  getProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<Product> {
    return this.productService.getProductById(productId);
  }

  @Get()
  getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @Post()
  addProduct(@Body() dto: AddProductDto): Promise<Product> {
    return this.productService.addProduct(dto);
  }

  @Patch(':id')
  editProductById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: EditProductDto,
  ): Promise<Product> {
    return this.productService.editProductById(productId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<Product> {
    return this.productService.deleteProductById(productId);
  }
}
