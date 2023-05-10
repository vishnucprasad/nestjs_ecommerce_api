import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CartService } from './cart.service';
import { GetUser } from '../auth/decorator';
import { AddtoCartDto } from './dto';

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('id') userId: number) {
    return this.cartService.getCart(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  addToCart(@GetUser('id') userId: number, @Body() dto: AddtoCartDto) {
    return this.cartService.addCart(userId, dto);
  }
}
