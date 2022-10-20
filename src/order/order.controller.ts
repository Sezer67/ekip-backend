import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@UseGuards(AuthGuard('user-jwt'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Customer)
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Req() request: Request,
  ): Promise<Order> {
    const order = await this.orderService.createOrder(dto, request);
    if (!order) {
      throw new HttpException('Yetersiz Bakiye', 400);
    }
    return order;
  }

  @Get('@me')
  getOrder(@Req() request: Request) {
    return this.orderService.get(request);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Get('@me/sales')
  getSellerSaledProducts(@Req() request: Request) {
    return this.orderService.getSellerSaledProducts(request);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Get('@me/sales/year')
  getSellerSaledProductsYear(@Req() request: Request) {
    return this.orderService.getSellerSaledProductsYear(request);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Get('@me/my-customer')
  getMyPendingOrders(@Req() request: Request) {
    return this.orderService.getSellerPendingOrder(request);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() dto: { isAccept: boolean }) {
    return this.orderService.updateOrder(id, dto);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteById(id);
  }
}
