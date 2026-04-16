import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerHistoryDto } from './create-career-history.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateCareerHistoryDto extends PartialType(CreateCareerHistoryDto) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id?: number;
}
