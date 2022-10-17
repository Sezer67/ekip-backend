import {
  IsString,
  IsAlpha,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsAlpha()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  lastName: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  profilePicture: string;

  @IsOptional()
  @IsEnum([Role.Customer, Role.Seller])
  role: Role;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;
}
