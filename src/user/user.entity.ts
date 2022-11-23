import { Role } from 'src/enums/role.enum';
import { Product } from 'src/product/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  profilePicture: string;

  @Column({ type: 'enum', enum: Role, default: Role.Customer })
  role: Role;

  @Column({ type: 'boolean', default: 'false', name: 'is_freeze' })
  isFreeze: boolean;

  @Column()
  password: string;

  @Column({ type: 'float', name: 'balance', default: 0 })
  balance: number;

  @OneToMany(() => Product, (product) => product.ownerId)
  products: Product[];
}
