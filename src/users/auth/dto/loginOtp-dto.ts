import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginOtpDto {
  @ApiProperty({ example: 'usuario@empresa.com', description: 'Correo electrónico al que se enviará el OTP' })
  @IsEmail()
  email: string;
}
