import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UseGuards(AuthGuard('user-jwt'))
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/room/:roomid')
  getMessagerByRoomId(@Param('roomid') roomid: string) {
    return this.messageService.getMessagesByRoomId(roomid);
  }

  @Post('/send')
  sendMessage(@Body() dto: CreateMessageDto, @Req() request: Request) {
    return this.messageService.createMessage(dto, request);
  }
}
