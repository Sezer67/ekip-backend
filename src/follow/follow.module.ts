import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { FollowController } from './follow.controller';
import { Follow } from './follow.entity';
import { FollowService } from './follow.seervice';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowController],
  providers: [FollowService, UserService, JwtService],
  exports: [],
})
export class FollowModule {}
