import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateIdeaDto, UpdateIdeaDto } from './dto/create-idea.dto';
import { Idea } from './idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
  ) {}

  async createIdea(dto: CreateIdeaDto, request: Request): Promise<Idea> {
    try {
      const user = request.user as User;
      const idea = this.ideaRepo.create({
        ...dto,
        createdAt: new Date(),
        userId: user,
      });

      return await this.ideaRepo.save(idea);
    } catch (error) {
      throw error;
    }
  }

  async getMyIdeas(request: Request): Promise<Idea[]> {
    try {
      const user = request.user as User;
      const ideas = await this.ideaRepo.find({
        where: {
          userId: {
            id: user.id,
          },
        },
        order: {
          answerAt: 'DESC',
          createdAt: 'DESC',
        },
      });
      return ideas;
    } catch (error) {
      throw error;
    }
  }

  async getAllIdeas(): Promise<Idea[]> {
    try {
      const ideas = await this.ideaRepo.find({
        relations: {
          userId: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return ideas;
    } catch (error) {
      throw error;
    }
  }
  async getIdeaById(id: string): Promise<Idea> {
    try {
      const idea = await this.ideaRepo.findOne({
        where: {
          id,
        },
        relations: {
          userId: true,
        },
        select: {
          userId: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      });
      return idea;
    } catch (error) {
      throw error;
    }
  }
  async asnwerIdeaById(id: string, dto: UpdateIdeaDto): Promise<Idea> {
    try {
      const idea = await this.ideaRepo.findOne({
        where: {
          id,
        },
      });
      idea.answer = dto.answer;
      idea.answerAt = new Date();

      return await this.ideaRepo.save(idea);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string, request: Request): Promise<string> {
    try {
      const user = request.user as User;
      const idea = await this.ideaRepo.findOne({
        where: {
          id,
        },
        relations: {
          userId: true,
        },
        select: {
          userId: {
            id: true,
          },
        },
      });

      if (user.role !== Role.Admin && idea.userId.id !== user.id) {
        throw new HttpException('Bu sizin iletiniz değil', 400);
      }

      await this.ideaRepo.delete(id);

      return id;
    } catch (error) {}
  }
}
