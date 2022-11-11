import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async createComment(
    dto: CreateCommentDto,
    request: Request,
  ): Promise<Comment> {
    try {
      const { comment, productId, ref } = dto;
      const newComment = this.commentRepo.create({
        ref: ref ? ref : null,
        comment,
        productId,
        createdAt: new Date(),
        userId: request.user as User,
      });

      return await this.commentRepo.save(newComment);
    } catch (error) {
      throw error;
    }
  }

  async getCommentByProductId(id: string): Promise<Comment[]> {
    try {
      const comments = await this.commentRepo.find({
        where: {
          productId: id,
        },
        relations: {
          userId: true,
        },
        select: {
          userId: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        order: {
          createdAt: 'ASC',
        },
      });
      return comments;
    } catch (error) {
      throw error;
    }
  }
}
