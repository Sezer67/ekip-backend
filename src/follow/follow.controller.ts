import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.seervice';

@UseGuards(AuthGuard('user-jwt'), RolesGuard)
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Roles(Role.Customer)
  @Get('/customer')
  getCustomerFollowers(@Req() request: Request) {
    return this.followService.getFollowersCustomer(request);
  }
  @Roles(Role.Seller)
  @Get('/seller')
  getSellerFollowers(@Req() request: Request) {
    return this.followService.getFollowersSeller(request);
  }

  @Roles(Role.Customer)
  @Post()
  createFollow(@Body() dto: CreateFollowDto, @Req() request: Request) {
    return this.followService.createFollow(dto, request);
  }
}
