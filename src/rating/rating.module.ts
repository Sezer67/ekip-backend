import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './rating.entity';
import { RatingService } from './rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  controllers: [],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
