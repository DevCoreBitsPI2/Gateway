import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  id_administrator: number;
}
