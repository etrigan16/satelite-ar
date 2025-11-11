import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AdminGuard } from "../common/guards/admin.guard";

// Controlador REST para Posts
// Documentación Swagger: se recomienda instalar @nestjs/swagger y anotar cada endpoint
// yarn add -D @nestjs/swagger swagger-ui-express
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET /posts?status=&tagIds=&search=
  @Get()
  async list(
    @Query("status") status?: "draft" | "published",
    @Query("tagIds") tagIdsCsv?: string,
    @Query("search") search?: string,
  ) {
    const tagIds = tagIdsCsv ? tagIdsCsv.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
    return this.postsService.list({ status, tagIds, search });
  }

  // GET /posts/:id
  @Get(":id")
  async getById(@Param("id") id: string) {
    const post = await this.postsService.findById(id);
    return post;
  }

  // POST /posts
  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  // PATCH /posts/:id
  @Patch(":id")
  @UseGuards(AdminGuard)
  async update(@Param("id") id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  // DELETE /posts/:id
  @Delete(":id")
  @UseGuards(AdminGuard)
  async remove(@Param("id") id: string) {
    await this.postsService.remove(id);
    return { success: true };
  }
}