// DTO para crear Post
// Se agregan validadores para garantizar tipos y formatos correctos en el payload.
import { IsString, MinLength, IsOptional, IsIn, IsArray, IsISO8601, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

// Status permitido para Post; si no se envía, el servicio lo tratará como 'draft'.
export type PostStatus = 'draft' | 'published';

export class CreatePostDto {
  // Título del artículo; se recorta espacio extra para consistencia
  @IsString({ message: 'title debe ser texto' })
  @MinLength(3, { message: 'title debe tener al menos 3 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  // Contenido del artículo (texto largo)
  @IsString({ message: 'content debe ser texto' })
  @MinLength(1, { message: 'content no puede estar vacío' })
  content: string;

  // Estado del artículo (enum en DB). Opcional, por defecto 'draft'.
  @IsOptional()
  @IsIn(['draft', 'published'], { message: 'status debe ser draft o published' })
  status?: PostStatus;

  // Fecha del evento en formato ISO 8601 (ej: 2024-01-02T03:04:05Z)
  @IsISO8601({}, { message: 'eventDate debe ser una fecha ISO válida' })
  eventDate: string;

  // IDs de tags a asociar (cuid strings)
  @IsOptional()
  @IsArray({ message: 'tagIds debe ser un arreglo' })
  @IsString({ each: true, message: 'cada tagId debe ser un string' })
  tagIds?: string[];

  // Campos de fuente (opcionales)
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