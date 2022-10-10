import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsAlpha,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ResponseCreateUserDto } from './create-user.dto';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  username?: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export type ResponseLoginUserDto = ResponseCreateUserDto & {
  token?: string;
};
