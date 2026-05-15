import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/src/common';
import { area_status, TypeStatusAreaListDto } from '../enum/status_area.enum';

export class AreaPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'active', description: 'Filtro por estado del área' })
  @IsOptional()
  @IsEnum(TypeStatusAreaListDto, {
    message: `valid types are: ${TypeStatusAreaListDto}`,
  })
  status?: area_status;

  @ApiPropertyOptional({ example: 'Talento Humano', description: 'Búsqueda por nombre o descripción' })
  @IsOptional()
  @IsString()
  search?: string;
}
