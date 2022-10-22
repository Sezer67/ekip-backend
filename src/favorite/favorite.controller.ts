import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteService } from './favorite.service';

@UseGuards(AuthGuard('user-jwt'), RolesGuard)
@Roles(Role.Customer)
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  get(@Req() request: Request) {
    return this.favoriteService.getFavorites(request);
  }

  @Post()
  addFavorite(@Body() dto: CreateFavoriteDto, @Req() request: Request) {
    return this.favoriteService.createFavorite(dto, request);
  }

  @Delete(':id')
  removeFavorite(@Param('id') id: string, @Req() request: Request) {
    return this.favoriteService.removeFavorite(id, request);
  }
}
