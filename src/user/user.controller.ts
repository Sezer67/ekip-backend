import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserGuard } from 'src/auth/guards/user.guard';
import { UpdateUserDto } from './dto/update-user-dto';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async register(@Body() dto: CreateUserDto): Promise<ResponseCreateUserDto> {
    return this.userService.register(dto);
  }

  //Put için userguard
  @Put('/:id')
  @UseGuards(UserGuard)
  async put(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseCreateUserDto> {
    console.log(id);
    return this.userService.update(id, dto);
  }
}
