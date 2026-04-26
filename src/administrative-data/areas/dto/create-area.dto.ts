import {IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { area_status, TypeStatusAreaListDto } from "../enum/status_area.enum";

export class CreateAreaDto{

  @IsString()
  name: string

  @IsString()
  description: string

  @IsNumber()
  @IsPositive()
  id_administrator: number

  @IsEnum(TypeStatusAreaListDto,{
    message: `valid types are: ${TypeStatusAreaListDto}`
  })
  @IsOptional()
  status?: area_status
}