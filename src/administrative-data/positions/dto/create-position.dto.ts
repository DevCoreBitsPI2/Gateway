import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { position_status, TypePositionListDto } from '../enum/status_position.enum';

export class CreatePositionDto {
  @ApiProperty({ example: 'Desarrollador Backend', description: 'Nombre del cargo' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 3500000, description: 'Salario base del cargo' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  base_salary?: number;

  @ApiProperty({ example: 'Responsable del desarrollo de APIs y microservicios', description: 'Descripción del cargo' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1, description: 'ID del administrador que crea el cargo' })
  @IsNumber()
  @IsPositive()
  id_administrator: number;

  @ApiProperty({ example: 2, description: 'ID del área a la que pertenece el cargo' })
  @IsNumber()
  @IsPositive()
  id_area: number;

  @ApiPropertyOptional({ example: 3, description: 'ID del cargo padre en la jerarquía (opcional)' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  parent_position_id?: number;

  @ApiPropertyOptional({ enum: position_status, example: position_status.active, description: 'Estado del cargo' })
  @IsEnum(TypePositionListDto, {
    message: `valid types are: ${TypePositionListDto}`,
  })
  @IsOptional()
  status?: position_status;

  @ApiProperty({ example: 3, description: 'Número de vacantes disponibles para este cargo' })
  @IsNumber()
  @IsPositive()
  vacancies: number;
}
