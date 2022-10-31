import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    private readonly productService: ProductService,
  ) {}

  async createFavorite(
    dto: CreateFavoriteDto,
    request: Request,
  ): Promise<Favorite> {
    try {
      const user = request.user as User;

      // validation to unique product for one user
      const validate = await this.favoriteRepo.findOne({
        where: {
          userId: {
            id: user.id,
          },
          productId: {
            id: dto.productId,
          },
        },
      });

      if (validate) {
        throw new HttpException('Zaten ekli', 400);
      }

      const product = await this.productService.getProductById(dto.productId);

      const favorite = this.favoriteRepo.create({
        productId: product,
        userId: user,
        createdAt: new Date(),
      });

      return await this.favoriteRepo.save(favorite);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getFavorites(request: Request): Promise<Favorite[]> {
    try {
      const favotires = await this.favoriteRepo.find({
        where: {
          userId: {
            id: (request.user as User).id,
          },
        },
        relations: {
          productId: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return favotires;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async removeFavorite(id: string, request: Request): Promise<string> {
    try {
      const favorite = await this.favoriteRepo.findOne({
        where: {
          userId: {
            id: (request.user as User).id,
          },
          productId: {
            id,
          },
        },
      });
      await this.favoriteRepo.delete({ id: favorite.id });
      return id;
    } catch (error) {}
  }
}
