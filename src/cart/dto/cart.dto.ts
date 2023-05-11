import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
