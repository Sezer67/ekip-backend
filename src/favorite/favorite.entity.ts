import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favorite')
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  productId: Product;
}
