import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  base_salary: number;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  id_administrator: number;

  @IsNumber()
  @IsPositive()
  id_area: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  parent_position_id?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  created_at?: Date;
}
