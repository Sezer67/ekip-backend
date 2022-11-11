import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/user/user.entity';
import { ProductCreateDto } from './dto/product-create-dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductService } from './product.service';

@Controller('product')
@UseGuards(AuthGuard('user-jwt'), RolesGuard)
@Roles(Role.Admin)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.Seller)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createProduct(@Body() dto: ProductCreateDto, @Req() request: Request) {
    return this.productService.createProduct(dto, request);
  }

  @Roles(Role.Seller, Role.Customer)
  @Get()
  get(@Query() queryDto: ProductQueryDto) {
    return this.productService.getProduct(queryDto);
  }

  @Roles(Role.Seller)
  @Get('@me')
  getOwnerProducts(@Req() request: Request) {
    return this.productService.getOwnerProducts(request);
  }

  @Roles(Role.Seller, Role.Customer)
  @Get('/trends')
  getTrends() {
    return this.productService.getTrendProduct();
  }
  @Roles(Role.Seller, Role.Customer)
  @Get('/new')
  getNew() {
    return this.productService.getNewProduct();
  }
  @Roles(Role.Seller, Role.Customer)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Roles(Role.Seller, Role.Customer)
  @Put(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: ProductUpdateDto,
    @Req() request: Request,
  ) {
    if (!dto.showCount && (request.user as User).role === Role.Customer) {
      throw new HttpException('Yetkiniz Yok', HttpStatus.FORBIDDEN);
    }
    return this.productService.updateProductById(id, dto);
  }

  @Roles(Role.Customer)
  @Put('rate/:id')
  evaluateProductById(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() dto: { rating: number },
  ) {
    return this.productService.evaluateProduct(id, dto, request);
  }

  @Roles(Role.Customer)
  @Get('rate/isRating')
  getIsRating(@Req() request: Request) {
    return this.productService.getIsRating(request);
  }
}
