import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
