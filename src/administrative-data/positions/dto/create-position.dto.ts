import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { position_status, TypePositionListDto } from '../enum/status_position.enum';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  base_salary?: number;

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

  @IsEnum(TypePositionListDto, {
    message: `valid types are: ${TypePositionListDto}`
  })
  @IsOptional()
  status?: position_status

  @IsNumber()
  @IsPositive()
  vacancies: number;
}
