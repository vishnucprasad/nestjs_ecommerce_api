import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
