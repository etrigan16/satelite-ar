import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { Tag } from '@prisma/client';

// Controlador REST para Tags
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // GET /tags
  @Get()
  async list(): Promise<Tag[]> {
    return this.tagsService.list();
  }

  // GET /tags/:id
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.tagsService.findById(id);
  }

  // POST /tags
  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  // PATCH /tags/:id
  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.update(id, dto);
  }

  // DELETE /tags/:id
  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    await this.tagsService.remove(id);
    return { success: true };
  }
}
