import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';
import { OrderModule } from './order/order.module';
import { FavoriteModule } from './favorite/favorite.module';
import { FollowModule } from './follow/follow.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    SalesModule,
    OrderModule,
    FavoriteModule,
    FollowModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
