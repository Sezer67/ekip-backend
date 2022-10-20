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

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', name: 'is_accept', default: false })
  isAccept: boolean;

  @Column({ type: 'boolean', name: 'is_answer', default: false })
  isAnswer: boolean;

  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    name: 'answer_at',
    nullable: true,
  })
  answerAt: Date;

  @Column({ type: 'smallint', name: 'piece', nullable: false })
  piece: number;

  @Column({ type: 'float', name: 'total_price', default: 0 })
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customerId: User;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  ownerId: User;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  productId: Product;
}
