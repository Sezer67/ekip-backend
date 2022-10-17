import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Sales } from './sales.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sales)
    private readonly salesRepo: Repository<Sales>,
  ) {}

  async getAllSales(): Promise<Sales[]> {
    try {
      const sales = await this.salesRepo.find({
        relations: {
          customerId: true,
          ownerId: true,
          productId: true,
        },
      });
      return sales;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async getSalesByUser(request: Request): Promise<Sales[]> {
    try {
      const { user } = request;
      let sales: Sales[] = [];
      if ((user as User).role === Role.Seller) {
        sales = await this.salesRepo.find({
          where: {
            ownerId: {
              id: (user as User).id,
            },
          },
        });
      } else {
        // customer
        sales = await this.salesRepo.find({
          where: {
            customerId: {
              id: (user as User).id,
            },
          },
        });
      }

      return sales;
    } catch (error) {}
  }
}
