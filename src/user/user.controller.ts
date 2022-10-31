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
import { UpdateUserDto } from './dto/update-user-dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('user-jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get('all')
  getAllUsers() {
    return this.userService.allUsers();
  }

  @Post()
  async register(@Body() dto: CreateUserDto): Promise<ResponseCreateUserDto> {
    return this.userService.register(dto);
  }

  //Put için userguard
  @Put('/:id')
  async put(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseCreateUserDto> {
    console.log(id);
    return this.userService.update(id, dto);
  }
}
