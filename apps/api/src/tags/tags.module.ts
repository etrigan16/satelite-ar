import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

// Módulo de Tags: registra controlador y servicio
@Module({
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
