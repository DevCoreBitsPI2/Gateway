import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScanEmployeeQrDto {
  @ApiProperty({ description: 'Token temporal contenido en el código QR' })
  @IsString()
  qrToken: string;
}
