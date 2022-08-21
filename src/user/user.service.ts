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
      { username: user.username },
      { subject: user.id, expiresIn: '1h', secret: this.JWT_SECRET },
    );
    response.cookie('token', token, { httpOnly: true });
    delete user.password;

    return { ...user, token };
  }

  async getCurrentUser(
    request: Request,
  ): Promise<ResponseLoginUserDto> {
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
