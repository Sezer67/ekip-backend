import {
  IsNotEmpty,
  IsString,
  IsAlpha,
  IsEmail,
  MinLength,
} from 'class-validator';

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
  @IsString()
  @MinLength(6)
  password: string;
}

export type ResponseCreateUserDto = Omit<CreateUserDto, 'password'>;
