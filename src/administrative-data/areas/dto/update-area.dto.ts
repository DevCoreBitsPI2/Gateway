import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive } from 'class-validator';
import { CreateAreaDto } from './create-area.dto';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {
  @ApiProperty({ example: 3, description: 'ID del área a actualizar' })
  @IsNumber()
  @IsPositive()
  id: number;
}
