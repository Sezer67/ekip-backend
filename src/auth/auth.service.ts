import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LoginUserDto,
  ResponseLoginUserDto,
} from 'src/user/dto/login-user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
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
  async login(
    dto: LoginUserDto,
    response: Response,
  ): Promise<ResponseLoginUserDto> {
    const { username, email } = dto;
    if (!username && !email)
      this.createResponse(
        'error',
        'Username veya Email adresinizi girmelisiniz.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.getByUsernameAndEmail(
      username ? username : '',
      email ? email : '',
    );
    if (!user)
      this.createResponse(
        'error',
        'Böyle bir kullanıcı adı veya email mevcut değil',
        HttpStatus.BAD_REQUEST,
      );

    const passwordCheck = await bcrypt.compare(dto.password, user.password);
    if (!passwordCheck)
      this.createResponse(
        'error',
        'Yanlış Şifre Girdiniz',
        HttpStatus.BAD_REQUEST,
      );
    const token = await this.jwtService.signAsync(
      { username: user.username, id: user.id },
      { subject: user.id, expiresIn: '1h', secret: this.JWT_SECRET },
    );
    response.cookie('token', token, { httpOnly: true });
    delete user.password;
    console.log('token : ', token);
    return { ...user, token };
  }

  async getCurrentUser(request: Request): Promise<ResponseLoginUserDto> {
    try {
      const token = request.cookies['token'];
      const data = await this.jwtService.verifyAsync(token, {
        secret: this.JWT_SECRET,
      });

      const user = await this.getUserById(data['id']);
      delete user.password;

      return { ...user, token };
    } catch (error) {
      this.createResponse(
        'error',
        'Kayıtlı giriş yok',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  async logout(response: Response) {
    response.clearCookie('token');
    return {
      message: 'success',
    };
  }
}
