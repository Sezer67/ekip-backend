import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { Rating } from 'src/rating/rating.entity';
import { RatingService } from 'src/rating/rating.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, CategoryEntity, Product, User, Rating]),
    JwtModule.register({ secret: 'ekip-secret' }),
    forwardRef(() => CategoryModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductService, UserService, RatingService],
  exports: [OrderService],
})
export class OrderModule {}
