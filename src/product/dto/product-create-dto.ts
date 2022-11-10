import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryEntity } from 'src/category/category.entity';

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsArray()
  images: string[];

  @IsNotEmpty()
  @IsArray()
  categories: string[];

  @IsNotEmpty()
  @IsString()
  description: string;
}
