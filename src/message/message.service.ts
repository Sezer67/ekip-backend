import { HttpException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ChatService } from 'src/chat-room/chat.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Cron('* * * * * *')
  async createMessage(
    dto: CreateMessageDto,
    request: Request,
  ): Promise<Message> {
    try {
      const chatRoom = await this.chatService.getRoomById(dto.chatRoomId);

      if (!chatRoom) {
        throw new HttpException('Chat Room Not Found', 404);
      }

      const user = request.user as User;
      const receiver = await this.userService.getUserById(dto.receiverId);

      const newMessage = this.messageRepo.create({
        chatRoomId: chatRoom,
        date: new Date(),
        receiverId: receiver,
        senderId: user,
        message: dto.message,
      });

      await this.messageRepo.save(newMessage);

      delete newMessage.receiverId.profilePicture;
      delete newMessage.receiverId.password;
      delete newMessage.receiverId.balance;
      delete newMessage.receiverId.username;

      delete newMessage.senderId.profilePicture;
      delete newMessage.senderId.password;
      delete newMessage.senderId.balance;
      delete newMessage.senderId.username;

      await this.messageGateway.sendMessageSocket(
        newMessage.receiverId.id,
        newMessage,
      );
      return await this.messageRepo.save(newMessage);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async getMessagesByRoomId(roomId: string): Promise<Message[]> {
    try {
      const roomMessages = await this.messageRepo.find({
        where: {
          chatRoomId: {
            id: roomId,
          },
        },
        relations: {
          receiverId: true,
          senderId: true,
        },
        select: {
          receiverId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          senderId: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: {
          date: 'ASC',
        },
      });

      return roomMessages;
    } catch (error) {}
  }
}
