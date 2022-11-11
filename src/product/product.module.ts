import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStrategy } from 'src/auth/strategies/user.strategy';
import { CategoryEntity } from 'src/category/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { Rating } from 'src/rating/rating.entity';
import { RatingService } from 'src/rating/rating.service';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    TypeOrmModule.forFeature([Product, CategoryEntity, User, Rating]),
    JwtModule.register({ secret: 'ekip-secret' }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    UserService,
    JwtModule,
    UserStrategy,
    RatingService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
