import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly productService: ProductService,
  ) {}

  async createOrder(dto: CreateOrderDto, request: Request): Promise<Order> {
    try {
      const product = await this.productService.getProductById(dto.productId);
      delete product.images;
      delete (request.user as User).profilePicture;
      const data = {
        piece: dto.piece,
        productId: product,
        createdAt: new Date(),
        customerId: request.user as User,
        ownerId: product.ownerId,
      };
      await this.productService.updateProductById(dto.productId, {
        stock: product.stock - dto.piece,
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
