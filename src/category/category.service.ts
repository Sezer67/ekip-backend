import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryCreateDto } from './dto/category-create.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  createResponse(msg: string, description: string, status: number) {
    throw new HttpException({ msg, description }, status);
  }

  async getAllCategory(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepo.find({});
    return categories;
  }

  async addCategory(dto: CategoryCreateDto): Promise<CategoryEntity> {
    try {
      const name = dto.name.charAt(0).toUpperCase() + dto.name.slice(1);
      const control = await this.categoryRepo.findOne({
        where: {
          name
        },
      });

      if (control) {
        this.createResponse(
          'error',
          'Böyle bir kategori adı mevcut',
          HttpStatus.BAD_REQUEST,
        );
      }
      const category = await this.categoryRepo.save({
        name
      });
      return category;
    } catch (error) {
      this.createResponse('error', error, HttpStatus.BAD_REQUEST);
    }
  }
}
