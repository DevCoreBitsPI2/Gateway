import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { status_enum, StatusEmployeeListDto } from '../enums/status.enum';

export class UpdateEmployeeDto {
  @ApiProperty({ example: 10, description: 'ID del empleado a actualizar' })
  @IsInt()
  id_employee: number;

  @ApiPropertyOptional({ example: 4, description: 'Nuevo ID de cargo' })
  @IsOptional()
  @IsInt()
  id_position?: number;

  @ApiPropertyOptional({ example: 2, description: 'Nuevo ID del gerente/supervisor', nullable: true })
  @IsOptional()
  @IsInt()
  id_manager?: number | null;

  @ApiPropertyOptional({ enum: status_enum, example: status_enum.active, description: 'Nuevo estado del empleado' })
  @IsOptional()
  @IsEnum(StatusEmployeeListDto, {
    message: `El estado debe ser uno de los siguientes` + StatusEmployeeListDto.join(', '),
  })
  status: status_enum;
}
