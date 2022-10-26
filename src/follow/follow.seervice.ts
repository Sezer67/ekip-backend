import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { Follow } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
    private readonly userService: UserService,
  ) {}

  async createFollow(dto: CreateFollowDto, request: Request): Promise<Follow> {
    try {
      const follower = request.user as User;
      // validation to unique product for one user
      const validate = await this.followRepo.findOne({
        where: {
          followerId: {
            id: follower.id,
          },
          followedId: {
            id: dto.followedId,
          },
        },
      });

      if (validate) {
        throw new HttpException('Zaten ekli', 400);
      }
      const followed = await this.userService.getUserById(dto.followedId);

      const newFollow = this.followRepo.create({
        followerId: follower,
        followedId: followed,
      });

      return await this.followRepo.save(newFollow);
    } catch (error) {}
  }

  async getFollowersCustomer(request: Request): Promise<Follow[]> {
    try {
      const user = request.user as User;
      const followers = await this.followRepo.find({
        where: {
          followerId: {
            id: user.id,
          },
        },
        relations: {
          followedId: true,
        },
        select: {
          followedId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
      });
      return followers;
    } catch (error) {}
  }
  async getFollowersSeller(request: Request): Promise<Follow[]> {
    try {
      const user = request.user as User;
      const followers = await this.followRepo.find({
        where: {
          followedId: {
            id: user.id,
          },
        },
        relations: {
          followerId: true,
        },
        select: {
          followerId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
      });
      return followers;
    } catch (error) {}
  }
}
