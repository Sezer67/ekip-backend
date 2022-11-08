import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user-dto';
import { Role } from 'src/enums/role.enum';
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

  async update(id: string, dto: UpdateUserDto): Promise<ResponseCreateUserDto> {
    const user = await this.getUserById(id);
    if (dto.password) {
      const hash = await bcrypt.hash(dto.password, this.round);
      dto.password = hash;
    }
    if (dto.balance) {
      dto.balance = user.balance + dto.balance;
    }
    Object.keys(dto).forEach((key) => {
      user[key] = dto[key];
    });
    await this.userRepo.save(user);
    delete user.password;

    return user;
  }

  async allUsers(): Promise<User[]> {
    try {
      const users = await this.userRepo.find({
        where: {
          role: Not(Role.Admin),
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          products: {
            id: true,
          },
          balance: true,
          role: true,
          isFreeze: true,
        },
        relations: {
          products: true,
        },
      });
      return users;
    } catch (error) {}
  }
}
