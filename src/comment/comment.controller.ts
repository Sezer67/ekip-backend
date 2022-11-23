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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(AuthGuard('user-jwt'))
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  createComment(@Body() dto: CreateCommentDto, @Req() request: Request) {
    return this.commentService.createComment(dto, request);
  }

  @Get(':id')
  getCommentsByProductId(@Param('id') id: string) {
    return this.commentService.getCommentByProductId(id);
  }
}
