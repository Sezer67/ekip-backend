import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    private readonly userService: UserService,
  ) {}

  async createRoom(dto: { id: string }, request: Request): Promise<Chat> {
    try {
      const user = request.user as User;
      // öyle bir sohbet odası var mı kontrolü
      let customerId = '';
      let sellerId = '';
      if (user.role === Role.Customer) {
        customerId = user.id;
        sellerId = dto.id;
      } else if (user.role === Role.Seller) {
        customerId = dto.id;
        sellerId = user.id;
      }

      const control = await this.chatRepo.findOne({
        where: {
          customerId: {
            id: customerId,
          },
          sellerId: {
            id: sellerId,
          },
        },
      });

      if (control) {
        throw new HttpException('Bu sohbet zaten mevcut', 400);
      }

      const customer = await this.userService.getUserById(customerId);
      const seller = await this.userService.getUserById(sellerId);

      const room = this.chatRepo.create({
        customerId: customer,
        sellerId: seller,
      });
      delete room.customerId.password;
      delete room.customerId.profilePicture;
      delete room.customerId.username;
      delete room.customerId.balance;

      delete room.sellerId.username;
      delete room.sellerId.balance;
      delete room.sellerId.password;
      delete room.sellerId.profilePicture;
      return await this.chatRepo.save(room);
    } catch (error) {
      throw error;
    }
  }

  async getRooms(request: Request): Promise<Chat[]> {
    try {
      const user = request.user as User;

      const userRooms = await this.chatRepo.find({
        where: [
          {
            customerId: {
              id: user.id,
            },
          },
          {
            sellerId: {
              id: user.id,
            },
          },
        ],
        relations: {
          customerId: true,
          sellerId: true,
        },
        select: {
          customerId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          sellerId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      });

      return userRooms;
    } catch (error) {
      throw error;
    }
  }

  async getRoomById(id: string): Promise<Chat> {
    try {
      const room = await this.chatRepo.findOne({
        where: {
          id,
        },
        relations: {
          customerId: true,
          sellerId: true,
        },
        select: {
          customerId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          sellerId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      });
      return room;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
