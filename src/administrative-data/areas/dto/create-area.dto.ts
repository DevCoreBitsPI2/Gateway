import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { area_status, TypeStatusAreaListDto } from '../enum/status_area.enum';

export class CreateAreaDto {
  @ApiProperty({ example: 'Recursos Humanos', description: 'Nombre del área' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Área encargada de la gestión del talento humano', description: 'Descripción del área' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1, description: 'ID del administrador responsable del área' })
  @IsNumber()
  @IsPositive()
  id_administrator: number;

  @ApiPropertyOptional({ enum: area_status, example: area_status.active, description: 'Estado del área' })
  @IsEnum(TypeStatusAreaListDto, {
    message: `valid types are: ${TypeStatusAreaListDto}`,
  })
  @IsOptional()
  status?: area_status;
}
