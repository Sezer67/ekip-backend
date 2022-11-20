import {
  IsNotEmpty,
  IsString,
  IsAlpha,
  IsEmail,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role:Role;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export type ResponseCreateUserDto = Omit<CreateUserDto, 'password'>;
