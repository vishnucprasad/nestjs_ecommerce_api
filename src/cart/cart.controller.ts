import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../auth/guard';
import { CartService } from './cart.service';
import { GetUser } from '../auth/decorator';
import { CartDto } from './dto';

@UseGuards(AccessGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('id') userId: number) {
    return this.cartService.getCart(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  addToCart(@GetUser('id') userId: number, @Body() dto: CartDto) {
    return this.cartService.addCart(userId, dto);
  }

  @Delete()
  removeFromCart(@GetUser('id') userId: number, @Body() dto: CartDto) {
    return this.cartService.removeFromCart(userId, dto);
  }
}
