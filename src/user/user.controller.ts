import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import {JwtService} from '@nestjs/jwt'
import { UserGuard } from 'src/guards/user.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,private jwtService: JwtService) {}

  @Post()
  async register(@Body() dto:CreateUserDto):Promise<ResponseCreateUserDto>{
    return this.userService.register(dto);
  }

  //Put için userguard
  @Put('/:id')
  @UseGuards(UserGuard)
  async put(@Param('id') id:string ){
    return id;
  }
  
}
