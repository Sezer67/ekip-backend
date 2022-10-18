import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, CategoryEntity, Product]),
    forwardRef(() => CategoryModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductService],
  exports: [OrderService],
})
export class OrderModule {}
