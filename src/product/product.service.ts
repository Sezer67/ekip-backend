import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { CategoryEntity } from 'src/category/category.entity';
import { RatingService } from 'src/rating/rating.service';
import { User } from 'src/user/user.entity';
import {
  Any,
  ArrayContains,
  Between,
  ILike,
  In,
  MoreThan,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import { ProductCreateDto } from './dto/product-create-dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly ratingService: RatingService,
  ) {}

  createResponse(msg: string, description: string, status: number) {
    throw new HttpException({ msg, description }, status);
  }

  async createProduct(
    dto: ProductCreateDto,
    request: Request,
  ): Promise<Product> {
    try {
      // const categoryValues: CategoryEntity[] = [];
      // for await (const catId of categories) {
      //   const category = await this.categoryRepo.findOne({
      //     where: {
      //       id: catId,
      //     },
      //   });
      //   categoryValues.push(category);
      // }
      const product = {
        ...dto,
        ownerId: request.user as User,
        createdAt: new Date(),
      };
      const newProduct = await this.productRepo.save(product);
      return newProduct;
    } catch (error) {
      this.createResponse('error', error, HttpStatus.BAD_REQUEST);
    }
  }

  async getOwnerProducts(request: Request): Promise<Product[]> {
    try {
      const products = await this.productRepo.find({
        where: {
          ownerId: {
            id: (request.user as User).id,
          },
        },
      });
      return products;
    } catch (error) {
      this.createResponse('error', error, HttpStatus.BAD_REQUEST);
    }
  }

  async getTrendProduct(): Promise<Product[]> {
    try {
      const products = await this.productRepo.find({
        where: {
          stock: MoreThanOrEqual(1),
          showCount: MoreThan(0),
        },
        relations: {
          ownerId: true,
        },
        select: {
          ownerId: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        order: {
          showCount: 'DESC',
        },
        take: 50,
      });
      return products;
    } catch (error) {
      this.createResponse('error', error, HttpStatus.BAD_REQUEST);
    }
  }

  async getNewProduct(): Promise<Product[]> {
    try {
      // son 1 ay
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const products = await this.productRepo.find({
        where: {
          stock: MoreThanOrEqual(1),
          createdAt: Raw((alias) => `${alias} > :date`, { date: date }),
        },
        relations: {
          ownerId: true,
        },

        select: {
          ownerId: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: 50,
      });
      return products;
    } catch (error) {
      this.createResponse('error', error, HttpStatus.BAD_REQUEST);
    }
  }

  async getProduct(query: ProductQueryDto): Promise<Product[]> {
    try {
      const queryReq: any = {};
      {
        const where: any = {};
        const order: any = {};
        const select: any = {};
        const relations: any = {};
        if (query.categories) {
          // and ilike id and ilike id and ...
          const categoriIds = query.categories.split(',');
          where.categories = ArrayContains(categoriIds);
        }
        if (query.isShowCount) {
          order.showCount = 'DESC';
        }
        if (query.name) {
          where.name = ILike(`%${query.name}%`);
        }
        if (query.startPrice) {
          if (query.endPrice) {
            where.price = Between(query.startPrice, query.endPrice);
          } else {
            where.price = MoreThanOrEqual(query.startPrice);
          }
        }
        if (query.limit) {
          queryReq.take = query.limit;
        }
        if (query.offset) {
          queryReq.skip = query.offset;
        }

        select.ownerId = {
          id: true,
          firstName: true,
          lastName: true,
        };
        where.stock = MoreThanOrEqual(1);
        relations.ownerId = true;
        queryReq.relations = relations;
        queryReq.select = select;
        queryReq.where = where;
        queryReq.order = order;
      }

      const products = await this.productRepo.find(queryReq);

      return products;

      // if (query.categories) {
      //   const splittedCategories = query.categories.split(',');
      //   for await (const id of splittedCategories) {
      //     const product = await this.productRepo.findOne({
      //       where: { categories: ILike(`%${id}%`), stock: MoreThanOrEqual(1) },
      //       order: {
      //         name: 'ASC',
      //       },
      //     });
      //     result.push(product);
      //   }
      // }
      // if (query.ownerId) {
      //   console.log('owner id');
      //   // satıcının eklediği ürünler - sales da ise satıcının sattığı ürünler gelicek
      //   const products = await this.productRepo.find({
      //     where: {
      //       ownerId: {
      //         id: query.ownerId,
      //       },
      //     },
      //     order: {
      //       createdAt: 'ASC',
      //     },
      //   });
      //   result.push(...products);
      // }

      // if (result.length > 0) return result;
      // const products = await this.productRepo.find({
      //   where: {
      //     stock: MoreThanOrEqual(1),
      //   },
      //   order: {
      //     name: 'ASC',
      //   },
      // });
      // return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const product = await this.productRepo.findOne({
        where: { id },
        relations: {
          ownerId: true,
        },
        select: {
          ownerId: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      });
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProductById(id: string, dto: ProductUpdateDto): Promise<Product> {
    try {
      const product = await this.productRepo.findOne({
        where: { id },
        relations: { customerIds: true },
        select: {
          customerIds: { id: true },
        },
      });
      if (!product) {
        this.createResponse('error', 'Ürün Bulunamadı', HttpStatus.BAD_REQUEST);
      }
      if (dto.showCount) {
        dto.showCount = product.showCount + 1;
      }
      if (dto.customerId) {
        const control = product.customerIds.find(
          (customer) => customer.id === dto.customerId.id,
        );
        if (!control) {
          product.customerIds.push(dto.customerId);
          // buraya pushlarken rating e de kayıt edecek
          this.ratingService.create({
            productId: product,
            userId: dto.customerId,
          });
        }
      }
      Object.keys(dto).forEach((key) => {
        if (key === 'customerId') return;
        product[key] = dto[key];
      });
      this.productRepo.save(product);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async evaluateProduct(
    id: string,
    dto: { rating: number },
    request: Request,
  ): Promise<number> {
    try {
      const product = await this.getProductById(id);
      product.ratingCount += 1;
      product.ratingPoint =
        (dto.rating + product.ratingPoint) / product.ratingCount;
      await this.productRepo.save(product);
      await this.ratingService.evaluate({
        productId: id,
        userId: (request.user as User).id,
      });
      return product.ratingPoint;
    } catch (error) {
      throw error;
    }
  }

  async getIsRating(request: Request) {
    try {
      const isRatings = await this.ratingService.getUserById(
        (request.user as User).id,
      );
      return isRatings;
    } catch (error) {
      throw error;
    }
  }
}
