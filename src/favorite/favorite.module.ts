import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, CategoryEntity, Product]),
    Product,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, ProductService],
  exports: [],
})
export class FavoriteModule {}
