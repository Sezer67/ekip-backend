import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/user/user.entity';

export class ProductUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  showCount?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsNotEmpty()
  customerId?: User;
}
