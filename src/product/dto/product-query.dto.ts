import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  categories?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform((value: any) => parseInt(value))
  startPrice?: number;

  @IsOptional()
  @Transform((value: any) => parseInt(value))
  endPrice?: number;

  @IsOptional()
  @Transform((value: any) => (value ? true : false))
  @IsBoolean()
  isShowCount?: boolean;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @Transform((value: any) => parseInt(value))
  limit?: number;

  @IsOptional()
  @Transform((value: any) => parseInt(value))
  offset?: number;
}
