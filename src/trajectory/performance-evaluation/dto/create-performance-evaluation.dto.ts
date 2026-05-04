import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreatePerformanceEvaluationDto {
  @ApiProperty({ example: 3, description: 'ID del director que realiza la evaluación' })
  @IsNumber()
  @IsPositive()
  id_director: number;

  @ApiPropertyOptional({ example: 'Excelente desempeño, cumple con todos los objetivos', description: 'Observaciones generales de la evaluación' })
  @IsString()
  @IsOptional()
  observations?: string;

  @ApiProperty({ example: '2025-06-30', description: 'Fecha de la evaluación (ISO 8601)' })
  @IsDate()
  @Type(() => Date)
  evaluation_date: Date;

  @ApiPropertyOptional({ example: 8.5, description: 'Puntuación de comunicación (mínimo 0)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  communication?: number;

  @ApiPropertyOptional({ example: 9, description: 'Puntuación de competencia técnica (mínimo 0)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  technical_proficiency?: number;

  @ApiPropertyOptional({ example: 7.5, description: 'Puntuación de liderazgo e influencia (mínimo 0)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  leadership_influence?: number;

  @ApiPropertyOptional({ example: 8, description: 'Puntuación de innovación (mínimo 0)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  innovation?: number;

  @ApiPropertyOptional({ example: 9.5, description: 'Puntuación de confiabilidad (mínimo 0)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reliability?: number;

  career_history?: any[];
}
