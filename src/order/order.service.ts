import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Between, MoreThan, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { SalesResponseType } from './dto/response-order.dto';
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
        console.log('girdi');
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
        balance: (request.user as User).balance - dto.piece * product.price,
      });
      const order = await this.orderRepo.save(data);
      return order;
    } catch (error) {}
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

  async getSellerSaledProducts(request: Request): Promise<SalesResponseType> {
    try {
      const user = request.user as User;
      const date = new Date();
      const orders = await this.orderRepo.findAndCount({
        where: {
          ownerId: {
            id: user.id,
          },
          isAccept: true,
          answerAt: Between(
            new Date(date.getFullYear(), date.getMonth(), 1),
            new Date(date.getFullYear(), date.getMonth() + 1, 1),
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
          startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        })
        .andWhere('order.answer_at < :endDate', {
          endDate: new Date(date.getFullYear(), date.getMonth() + 1, 1),
        })
        .getRawOne();

      const result = {
        sales: orders[0],
        count: orders[1],
        filterTotalTaking: totalMonth.filterTotalTaking,
      };
      return result;
    } catch (error) {}
  }

  async getSellerSaledProductsYear(request: Request): Promise<any[]> {
    try {
      const sorgu = await this.orderRepo
        .createQueryBuilder('order')
        .where('order.owner_id = :id', {
          id: (request.user as User).id,
        })
        .select("DATE_TRUNC('month', order.answer_at)", 'month')
        .addSelect('SUM(order.total_price)', 'taking')
        .groupBy("DATE_TRUNC('month', order.answer_at)")
        .getRawMany();
      return sorgu;
    } catch (error) {
      throw new HttpException(error, 400);
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
      // henüz bekliyor durumunda ise ürününstoğu artırılacak
      const order = await this.orderRepo.findOne({
        where: {
          id,
        },
        relations: {
          productId: true,
        },
        select: {
          productId: {
            id: true,
            stock: true,
          },
        },
      });
      if (!order.isAnswer) {
        await this.productService.updateProductById(order.productId.id, {
          stock: order.productId.stock + order.piece,
        });
      }
      await this.orderRepo.delete({ id });
      return id;
    } catch (error) {}
  }
}
