import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationDto } from '@/src/common';
import { position_status, TypePositionListDto } from '../enum/status_position.enum';

export class PositionPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'active', description: 'Filtro por estado del cargo' })
  @IsOptional()
  @IsEnum(TypePositionListDto, {
    message: `valid types are: ${TypePositionListDto}`,
  })
  status?: position_status;

  @ApiPropertyOptional({ example: 1, description: 'Filtro por ID de área' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id_area?: number;

  @ApiPropertyOptional({ example: 1, description: 'Filtro por ID del cargo padre' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  parent_position_id?: number;

  @ApiPropertyOptional({ example: 'Jefe', description: 'Búsqueda por nombre o descripción' })
  @IsOptional()
  @IsString()
  search?: string;
}
