import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  piece: number;
}

export class SellerSaledDto {
  @IsNotEmpty()
  @IsString()
  date: string;
}
