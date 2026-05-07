import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { status_enum, StatusEmployeeListDto } from '../enums/status.enum';

export class InviteUserDto {
  @ApiProperty({ example: 'empleado@empresa.com', description: 'Correo electrónico del empleado' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'María', description: 'Nombre del empleado' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'González', description: 'Apellido del empleado' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 28, description: 'Edad del empleado' })
  @IsInt()
  age: number;

  @ApiProperty({ example: 1001, description: 'Código único del empleado' })
  @IsInt()
  code: number;

  @ApiProperty({ enum: status_enum, example: status_enum.invited, description: 'Estado inicial del empleado' })
  @IsEnum(StatusEmployeeListDto, {
    message: `El estado debe ser uno de los siguientes` + StatusEmployeeListDto.join(', '),
  })
  status: status_enum;

  @ApiProperty({ example: 3, description: 'ID del cargo asignado al empleado' })
  @IsInt()
  id_position: number;

  @ApiPropertyOptional({ example: 5, description: 'ID del gerente/supervisor (opcional)', nullable: true })
  @IsOptional()
  @IsInt()
  id_manager?: number | null;

  @ApiProperty({ example: 1, description: 'ID del administrador que realiza la invitación' })
  @IsInt()
  id_administrator: number;
}
