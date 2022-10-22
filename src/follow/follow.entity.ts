import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('follow')
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // takip eden (only customer)
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  followerId: User;

  //takip edilen (only seller)
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followed_id' })
  followedId: User;
}
