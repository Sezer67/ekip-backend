import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  name: string;

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

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({ name: 'rating_point', default: 0, type: 'double precision' })
  ratingPoint: number;

  // @OneToMany(() => CategoryEntity, (category) => category.id, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'categoryIds' })
  // categories: CategoryEntity[];

  // ürünü satın alan müşteriler
  @ManyToMany(() => User)
  @JoinTable({ name: 'customerproducts' })
  customerIds: User[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  ownerId: User;
}
