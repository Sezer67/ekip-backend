import {
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isDefined } from 'class-validator';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserAuthPayload } from '../user.payload';
@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserAuthPayload): Promise<User> {
    const user = await this.userService.getUserById(payload.id);
    if (!isDefined(user)) {
      throw new UnauthorizedException();
    }
    if (user.isFreeze) {
      throw new ForbiddenException('Hesabınız Dondurulmuştur.');
    }
    delete user.password;
    return user;
  }
}
