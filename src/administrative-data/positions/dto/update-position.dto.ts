import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive } from 'class-validator';
import { CreatePositionDto } from './create-position.dto';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
  @ApiProperty({ example: 4, description: 'ID del cargo a actualizar' })
  @IsNumber()
  @IsPositive()
  id: number;
}
