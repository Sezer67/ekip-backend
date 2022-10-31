import { ideaEnum } from 'src/enums';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('idea')
export class Idea extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ideaEnum.Idea, name: 'type', nullable: false })
  type: ideaEnum.Idea;

  @Column({ name: 'subject' })
  subject: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'answer', nullable: true })
  answer: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'answer_at', nullable: true })
  answerAt: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: User;
}
