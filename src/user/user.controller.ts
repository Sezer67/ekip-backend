import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import {JwtService} from '@nestjs/jwt'
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,private jwtService: JwtService) {}

  @Post()
  async register(@Body() dto:CreateUserDto):Promise<ResponseCreateUserDto>{
    return this.userService.register(dto);
  }

  @Post('login')
  async login(@Body() dto:LoginUserDto,@Res({passthrough:true}) response:Response):Promise<ResponseCreateUserDto>{
    return this.userService.login(dto,response);
  }

  @Get()
  async user(@Req() request:Request){
    // console.log(request.headers.cookie);
    // const cookie = request.headers.cookie.split("=")[1];
    // const cookie = request.cookies["token"];
    // const data = await this.jwtService.verifyAsync(cookie,{
    //   secret:'ekip-secret'
    // });
    // return {cookie,data};
    return this.userService.getCurrentUser(request);
  }

  @Get('logout')
  async logout(@Res({passthrough:true}) response:Response){
    return this.userService.logout(response);
  }
}
