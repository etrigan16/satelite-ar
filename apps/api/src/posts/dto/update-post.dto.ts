// DTO para actualizar Post (parcial)
// Validaciones opcionales por campo para permitir PATCH/PUT seguro.
import { IsString, MinLength, IsOptional, IsIn, IsArray, IsISO8601, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export type PostStatus = 'draft' | 'published';

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: 'title debe ser texto' })
  @MinLength(3, { message: 'title debe tener al menos 3 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title?: string;

  @IsOptional()
  @IsString({ message: 'content debe ser texto' })
  @MinLength(1, { message: 'content no puede estar vacío' })
  content?: string;

  @IsOptional()
  @IsIn(['draft', 'published'], { message: 'status debe ser draft o published' })
  status?: PostStatus;

  @IsOptional()
  @IsISO8601({}, { message: 'eventDate debe ser una fecha ISO válida' })
  eventDate?: string;

  @IsOptional()
  @IsArray({ message: 'tagIds debe ser un arreglo' })
  @IsString({ each: true, message: 'cada tagId debe ser un string' })
  tagIds?: string[];

  @IsOptional()
  @IsString({ message: 'sourceApiName debe ser texto' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  sourceApiName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'sourceImageUrl debe ser una URL válida' })
  sourceImageUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'sourceDataUrl debe ser una URL válida' })
  sourceDataUrl?: string;
}