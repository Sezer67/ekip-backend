import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@UseGuards(AuthGuard('user-jwt'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto, @Req() request: Request) {
    return this.orderService.createOrder(dto, request);
  }

  @Get('@me')
  getOrder(@Req() request: Request) {
    return this.orderService.get(request);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Get('@me/my-customer')
  getMyPendingOrders(@Req() request: Request) {
    return this.orderService.getSellerPendingOrder(request);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteById(id);
  }
}
