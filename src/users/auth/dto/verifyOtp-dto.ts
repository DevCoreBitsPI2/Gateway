import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'usuario@empresa.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Token OTP recibido por correo' })
  @IsString()
  token: string;
}
