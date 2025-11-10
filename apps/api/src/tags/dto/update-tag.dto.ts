// DTO para actualizar Tag
// Validación opcional, permite actualizar solo el nombre.
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTagDto {
  @IsOptional()
  @IsString({ message: 'name debe ser texto' })
  @MinLength(2, { message: 'name debe tener al menos 2 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;
}