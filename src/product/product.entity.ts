import { CategoryEntity } from 'src/category/category.entity';
import { Sales } from 'src/sales/sales.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  name: string;

  @Column({
    type: 'boolean',
    name: 'is_saled',
    nullable: false,
    default: false,
  })
  isSaled: boolean;

  @Column({ type: 'float', name: 'price', nullable: false })
  price: number;

  @Column({ type: 'int', name: 'stock', nullable: false, default: 1 })
  stock: number;

  @Column({ type: 'simple-array', name: 'images', nullable: true })
  images: string[];

  @Column({ type: 'text', name: 'categoryIds', array: true, default: [] })
  categories: string[];

  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'int', name: 'show_count', default: 0 })
  showCount: number;

  // @OneToMany(() => CategoryEntity, (category) => category.id, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'categoryIds' })
  // categories: CategoryEntity[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  ownerId: User;

  @OneToMany(() => Sales, (sales) => sales.productId, { onDelete: 'CASCADE' })
  solds: Sales[];
}
