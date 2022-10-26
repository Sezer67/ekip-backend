import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ChatService } from './chat.service';

@UseGuards(AuthGuard('user-jwt'))
@Controller('chat-room')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('@me')
  getRooms(@Req() request: Request) {
    return this.chatService.getRooms(request);
  }

  @Post()
  createRoom(@Body() dto: { id: string }, @Req() request: Request) {
    return this.chatService.createRoom(dto, request);
  }
}
