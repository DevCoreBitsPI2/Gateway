import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página', default: 1 })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Cantidad de registros por página', default: 10 })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
