import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
  ) {}

  async create(dto: { productId: Product; userId: User }) {
    try {
      const rating = this.ratingRepo.create({
        productId: dto.productId,
        userId: dto.userId,
      });
      return await this.ratingRepo.save(rating);
    } catch (error) {
      throw error;
    }
  }

  async evaluate(dto: { productId: string; userId: string }) {
    try {
      const rating = await this.ratingRepo.findOne({
        where: {
          productId: {
            id: dto.productId,
          },
          userId: {
            id: dto.userId,
          },
        },
      });
      rating.isRating = true;
      return await this.ratingRepo.save(rating);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const userRatings = await this.ratingRepo.find({
        where: {
          userId: {
            id: userId,
          },
        },
        relations: {
          productId: true,
          userId: true,
        },
        select: {
          productId: {
            id: true,
          },
          userId: {
            id: true,
          },
        },
      });

      return userRatings;
    } catch (error) {
      throw error;
    }
  }
}
