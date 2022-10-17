import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';

export class CategoryCreateDto {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  name: string;
}
