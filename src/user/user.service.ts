import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto, ResponseLoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
@Injectable()
export class UserService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  round = 10;

  createResponse(msg: string, description: string, status: number) {
    throw new HttpException({ msg, description }, status);
  }

  //böyle bir kullanıcı adı veya email var mı kontrolü yapılıyor
  async getByUsernameAndEmail(username: string, email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: [
        {
          username,
        },
        { email },
      ],
    });
    if (user) return user;
    return null;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({
      id,
    });
    if (!user)
      this.createResponse(
        'error',
        'Kayıtlı giriş yok',
        HttpStatus.UNAUTHORIZED,
      );
    return user;
  }

  async register(dto: CreateUserDto): Promise<ResponseCreateUserDto> {
    const control = await this.getByUsernameAndEmail(dto.username, dto.email);
    if (control) {
      this.createResponse(
        'error',
        'Böyle bir kullanıcı adı veya email mevcut',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hash = await bcrypt.hash(dto.password, this.round);
    dto.password = hash;
    const user = await this.userRepo.save(dto);
    delete user.password;
    return user;
  }

}
