import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { status_enum, StatusEmployeeListDto } from '../enums/status.enum';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsInt()
  age: number;

  @IsInt()
  code: number;

  @IsEnum(StatusEmployeeListDto, {
    message:`El estado debe ser uno de los siguientes` + StatusEmployeeListDto.join(", ") 
  })
  status: status_enum;

  @IsInt()
  id_position: number;

  @IsOptional()
  @IsInt()
  id_manager?: number | null;

  @IsInt()
  id_administrator: number;
}
