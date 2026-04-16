import { PartialType } from '@nestjs/mapped-types';
import { CreatePerformanceEvaluationDto } from './create-performance-evaluation.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdatePerformanceEvaluationDto extends PartialType(CreatePerformanceEvaluationDto) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id?: number;
}
