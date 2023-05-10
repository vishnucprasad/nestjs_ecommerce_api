import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddtoCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
