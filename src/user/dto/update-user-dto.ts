import {
  IsString,
  IsAlpha,
  IsEmail,
  IsOptional,
  MinLength,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsAlpha()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  balance?: number;

  @IsOptional()
  @IsBoolean()
  isFreeze?: boolean;
}
