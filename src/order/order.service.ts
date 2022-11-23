import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto, SellerSaledDto } from './dto/create-order.dto';
import {
  BestSalesResponseType,
  SalesResponseType,
} from './dto/response-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}
  createResponse(msg: string, description: string, status: number) {
    throw new HttpException(description, status);
  }
  async getOrderById(id: string): Promise<Order> {
    try {
      const order = await this.orderRepo.findOne({
        where: { id },
        relations: {
          productId: true,
          ownerId: true,
          customerId: true,
        },
        select: {
          ownerId: {
            id: true,
            firstName: true,
            lastName: true,
            balance: true,
          },
          customerId: {
            id: true,
            firstName: true,
            lastName: true,
            balance: true,
          },
        },
      });
      return order;
    } catch (error) {
      this.createResponse(
        'Not Found',
        'Sipariş Bulunamadı',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createOrder(dto: CreateOrderDto, request: Request): Promise<Order> {
    try {
      const product = await this.productService.getProductById(dto.productId);
      delete product.images;
      delete (request.user as User).profilePicture;

      if ((request.user as User).balance < dto.piece * product.price) {
        throw new HttpException(
          {
            message: 'error',
            description: 'Yetersiz Bakiye',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const data = {
        piece: dto.piece,
        totalPrice: dto.piece * product.price,
        productId: product,
        createdAt: new Date(),
        customerId: request.user as User,
        ownerId: product.ownerId,
      };
      await this.productService.updateProductById(dto.productId, {
        stock: product.stock - dto.piece,
      });
      await this.userService.update((request.user as User).id, {
        balance: dto.piece * product.price * -1,
      });
      const order = await this.orderRepo.save(data);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async get(request: Request): Promise<Order[]> {
    const orders = await this.orderRepo.find({
      where: {
        customerId: {
          id: (request.user as User).id,
        },
      },
      relations: {
        productId: true,
        ownerId: true,
        customerId: true,
      },
      select: {
        ownerId: {
          id: true,
          firstName: true,
          lastName: true,
        },
        customerId: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      order: {
        isAnswer: 'ASC',
        answerAt: 'DESC',
        createdAt: 'DESC',
      },
    });
    return orders;
  }

  async getSellerPendingOrder(request: Request): Promise<Order[]> {
    const orders = await this.orderRepo.find({
      where: {
        ownerId: {
          id: (request.user as User).id,
        },
      },
      relations: {
        productId: true,
        ownerId: true,
        customerId: true,
      },
      select: {
        ownerId: {
          id: true,
          firstName: true,
          lastName: true,
        },
        customerId: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      order: {
        isAnswer: 'ASC',
        createdAt: 'DESC',
      },
    });

    return orders;
  }

  async getSellerSaledProducts(
    request: Request,
    dto: SellerSaledDto,
  ): Promise<SalesResponseType> {
    try {
      const user = request.user as User;
      const date = new Date(dto.date);

      const orders = await this.orderRepo.findAndCount({
        where: {
          ownerId: {
            id: user.id,
          },
          isAccept: true,
          answerAt: Between(
            new Date(date.getFullYear(), date.getMonth(), 1),
            new Date(date.getFullYear(), date.getMonth(), 31),
          ),
        },
        order: {
          answerAt: 'ASC',
        },
      });
      const totalMonth = await this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(order.total_price)', 'filterTotalTaking')
        .where('order.owner_id = :id', {
          id: user.id,
        })
        .andWhere('order.answer_at > :startDate', {
          startDate: new Date(date.getFullYear(), date.getMonth(), 2),
        })
        .andWhere('order.answer_at < :endDate', {
          endDate: new Date(date.getFullYear(), date.getMonth(), 31),
        })
        .getRawOne();

      const result = {
        sales: orders[0],
        count: orders[1],
        filterTotalTaking: totalMonth.filterTotalTaking,
      };
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getSellerSaledProductsYear(request: Request): Promise<Order[]> {
    try {
      const sorgu = await this.orderRepo
        .createQueryBuilder('order')
        .where('order.owner_id = :id', {
          id: (request.user as User).id,
        })
        .andWhere('order.is_answer = TRUE')
        .select("DATE_TRUNC('month', order.answer_at)", 'month')
        .addSelect('SUM(order.total_price)', 'taking')
        .groupBy("DATE_TRUNC('month', order.answer_at)")
        .getRawMany();
      return sorgu;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async getBestStats(
    request: Request,
  ): Promise<{ product: Product; count: number; sum: number }> {
    try {
      // en çok sipariş edilen ürünüm
      const orders = await this.orderRepo
        .createQueryBuilder('order')
        .select([
          'order.product_id',
          'product.*',
          'user.id',
          'user.firstName',
          'user.lastName',
        ])
        .addSelect(['COUNT(order.product_id)', 'SUM(order.piece)'])
        .leftJoin(Product, 'product', 'order.product_id = product.id')
        .leftJoin(User, 'user', 'order.owner_id = user.id')
        .where('order.owner_id = :id and order.is_accept = TRUE', {
          id: (request.user as User).id,
        })
        .groupBy('order.product_id')
        .addGroupBy('product.id')
        .addGroupBy('user.id')
        .orderBy('SUM(order.piece)', 'DESC')
        .limit(1)
        .getRawOne();

      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrder(id: string, dto: { isAccept: boolean }): Promise<Order> {
    try {
      const order = await this.getOrderById(id);
      order.isAccept = dto.isAccept;
      order.isAnswer = true;
      order.answerAt = new Date();
      await this.orderRepo.save(order);
      if (dto.isAccept) {
        // satıcıya parası aktarılacak
        await this.productService.updateProductById(order.productId.id, {
          customerId: order.customerId,
        });
        await this.userService.update(order.ownerId.id, {
          balance: order.piece * order.productId.price,
        });
      } else {
        // ürün stoğu geri verilecek
        // müşterinin parası iade edilecek
        await this.productService.updateProductById(order.productId.id, {
          stock: order.piece + order.productId.stock,
        });
        await this.userService.update(order.customerId.id, {
          balance: order.piece * order.productId.price,
        });
      }
      return order;
    } catch (error) {
      this.createResponse('Error', error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteById(id: string): Promise<string> {
    try {
      // eğer sipariş onaylanmışsa ürün stoğunda bi değişiklik olmuyacak
      // eğer onaylanmamışsa (onu reddet butonunda seller tarafında yapılacak)
      // henüz bekliyor durumunda ise ürününstoğu artırılacak ve para iade edilecek
      const order = await this.orderRepo.findOne({
        where: {
          id,
        },
        relations: {
          productId: true,
          customerId: true,
        },
        select: {
          productId: {
            id: true,
            stock: true,
          },
          customerId: {
            id: true,
          },
        },
      });
      if (!order.isAnswer) {
        await this.productService.updateProductById(order.productId.id, {
          stock: order.productId.stock + order.piece,
        });
        await this.userService.update(order.customerId.id, {
          balance: order.totalPrice,
        });
      }
      await this.orderRepo.delete({ id });
      return id;
    } catch (error) {}
  }

  async getBestSalesProducts(): Promise<BestSalesResponseType[]> {
    try {
      const orders = await this.orderRepo
        .createQueryBuilder('order')
        .select([
          'order.product_id',
          'product.*',
          'user.id',
          'user.firstName',
          'user.lastName',
          'SUM(order.piece)',
        ])
        .addSelect('COUNT(order.product_id)')
        .leftJoin(Product, 'product', 'order.product_id = product.id')
        .leftJoin(User, 'user', 'order.owner_id = user.id')
        .where('order.is_accept = TRUE and product.stock > 0')
        .groupBy('order.product_id')
        .addGroupBy('product.id')
        .addGroupBy('user.id')
        .orderBy('SUM(order.piece)', 'DESC')
        .limit(50)
        .getRawMany();

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async getAllSalesByDay(dto: {
    startDate: Date;
    endDate: Date;
  }): Promise<Order[]> {
    try {
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      const orders = await this.orderRepo.find({
        where: {
          isAccept: true,
          answerAt: Between(
            new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate(),
              0,
              0,
              0,
              0,
            ),
            new Date(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate(),
              23,
              59,
              59,
              999,
            ),
          ),
        },
        order: {
          answerAt: 'DESC',
        },
        relations: {
          customerId: true,
          productId: true,
          ownerId: true,
        },
        select: {
          customerId: {
            id: true,
            username: true,
          },
          ownerId: {
            id: true,
            username: true,
          },
          productId: {
            id: true,
            name: true,
          },
        },
      });
      return orders;
    } catch (error) {
      throw error;
    }
  }
}
