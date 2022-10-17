import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { SalesService } from './sales.service';

@UseGuards(AuthGuard('user-jwt'), RolesGuard)
@Controller('sale')
export class SalesController {
  constructor(private readonly salesServie: SalesService) {}

  @Roles(Role.Admin)
  @Get('/all')
  getAllSales() {
    return this.salesServie.getAllSales();
  }

  @Get('@me')
  getSalesByUser(@Req() request: Request) {
    return this.salesServie.getSalesByUser(request);
  }
}
