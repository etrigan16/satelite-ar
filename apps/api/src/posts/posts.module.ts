import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

// Módulo de Posts: agrupa controlador y servicio
@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}