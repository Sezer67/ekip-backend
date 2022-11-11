import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { Rating } from 'src/rating/rating.entity';
import { RatingService } from 'src/rating/rating.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, CategoryEntity, Product, Rating]),
    Product,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, ProductService, RatingService],
  exports: [],
})
export class FavoriteModule {}
