import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { AddProductDto } from './dto';
import { ProductService } from './product.service';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  getProductById(@Param('id') productId: number) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  addProduct(@Body() dto: AddProductDto) {
    return this.productService.addProduct(dto);
  }

  @Patch()
  editProductById() {}

  @Delete()
  deleteProductById() {}
}
