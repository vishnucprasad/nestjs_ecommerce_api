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
import { JwtGuard } from '../auth/guard';
import { AddProductDto, EditProductDto } from './dto';
import { ProductService } from './product.service';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.getProductById(productId);
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  addProduct(@Body() dto: AddProductDto) {
    return this.productService.addProduct(dto);
  }

  @Patch(':id')
  editProductById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: EditProductDto,
  ) {
    return this.productService.editProductById(productId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.deleteProductById(productId);
  }
}
