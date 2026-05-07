import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 10, description: 'ID del empleado cuyo perfil se actualiza' })
  @IsInt()
  id_employee: number;

  @ApiPropertyOptional({ example: 'https://cdn.empresa.com/fotos/empleado.jpg', description: 'URL de la foto de perfil' })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'photo_url debe ser una URL válida' })
  photo_url?: string;

  @ApiPropertyOptional({ example: 30, description: 'Edad del empleado (18–100)' })
  @IsOptional()
  @IsInt()
  @Min(18, { message: 'La edad mínima es 18 años' })
  @Max(100, { message: 'La edad máxima es 100 años' })
  age?: number;
}
