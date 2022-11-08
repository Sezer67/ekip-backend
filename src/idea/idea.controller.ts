import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateIdeaDto, UpdateIdeaDto } from './dto/create-idea.dto';
import { IdeaService } from './idea.service';

@UseGuards(AuthGuard('user-jwt'), RolesGuard)
@Controller('idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post()
  @Roles(Role.Customer, Role.Seller)
  createIdea(@Req() request: Request, @Body() dto: CreateIdeaDto) {
    return this.ideaService.createIdea(dto, request);
  }

  @Get('@me')
  @Roles(Role.Customer, Role.Seller)
  getMyIdeas(@Req() request: Request) {
    return this.ideaService.getMyIdeas(request);
  }
  @Get('all')
  @Roles(Role.Admin)
  getAllIdeas() {
    return this.ideaService.getAllIdeas();
  }
  @Get(':id')
  @Roles(Role.Admin)
  getIdeaById(@Param('id') id: string) {
    return this.ideaService.getIdeaById(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  updateIdeaById(@Param('id') id: string, @Body() dto: UpdateIdeaDto) {
    return this.ideaService.asnwerIdeaById(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Customer, Role.Seller)
  deleteIdeaById(@Param('id') id: string, @Req() request: Request) {
    return this.ideaService.delete(id, request);
  }
}
