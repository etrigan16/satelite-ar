// DTO para crear Tag
// Validación básica de nombre, con trimming para evitar espacios accidentales.
import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTagDto {
  // Nombre legible del tag (único)
  @IsString({ message: 'name debe ser texto' })
  @MinLength(2, { message: 'name debe tener al menos 2 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name: string;
}
