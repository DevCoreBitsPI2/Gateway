import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@empresa.com', description: 'Correo electrónico del administrador' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del administrador' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del administrador' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 35, description: 'Edad del administrador' })
  @IsInt()
  age: number;
}
