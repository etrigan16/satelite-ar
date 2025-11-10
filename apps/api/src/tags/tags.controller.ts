import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

// Controlador REST para Tags
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // GET /tags
  @Get()
  async list() {
    return this.tagsService.list();
  }

  // GET /tags/:id
  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.tagsService.findById(id);
  }

  // POST /tags
  @Post()
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  // PATCH /tags/:id
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  // DELETE /tags/:id
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.tagsService.remove(id);
    return { success: true };
  }
}