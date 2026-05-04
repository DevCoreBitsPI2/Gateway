import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { career_type_change, CareerTypeChangeListDto } from '../enum/career_type_change';

export class CreateCareerHistoryDto {
  @ApiProperty({ example: 'Ascenso por desempeño sobresaliente en el último trimestre', description: 'Descripción del evento de carrera' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-03-15', description: 'Fecha del evento (ISO 8601)' })
  @IsDate()
  @Type(() => Date)
  event_date: Date;

  @ApiProperty({ enum: career_type_change, example: career_type_change.promotion, description: 'Tipo de cambio en la carrera' })
  @IsEnum(CareerTypeChangeListDto, {
    message: `type must be one of the following values: ${CareerTypeChangeListDto}`,
  })
  type: career_type_change;

  @ApiProperty({ example: 10, description: 'ID del empleado al que pertenece el historial' })
  @IsNumber()
  @IsPositive()
  id_employee: number;

  @ApiPropertyOptional({ example: 7, description: 'ID de la evaluación de desempeño relacionada (opcional)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id_evaluation?: number;
}
