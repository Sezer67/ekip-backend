import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat-room/chat.entity';
import { ChatService } from 'src/chat-room/chat.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat, User])],
  controllers: [MessageController],
  providers: [
    MessageService,
    ChatService,
    UserService,
    JwtService,
    MessageGateway,
  ],
  exports: [],
})
export class MessageModule {}
