import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationDto } from '@/src/common';
import { contract_status, StatusContractListDto } from '../enum/contract_status.enum';
import { contract_type, TypeContractListDto } from '../enum/contract_type.enum';

export class ContractPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'valid', description: 'Filtro por estado del contrato' })
  @IsOptional()
  @IsEnum(StatusContractListDto, {
    message: `valid status are: ${StatusContractListDto}`,
  })
  status?: contract_status;

  @ApiPropertyOptional({ example: 'fixed_term_contract', description: 'Filtro por tipo de contrato' })
  @IsOptional()
  @IsEnum(TypeContractListDto, {
    message: `valid types are: ${TypeContractListDto}`,
  })
  contract_type?: contract_type;

  @ApiPropertyOptional({ example: 10, description: 'Filtro por ID de empleado' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id_employee?: number;

  @ApiPropertyOptional({ example: 5, description: 'Filtro por ID de manager' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id_manager?: number;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Fecha inicial para filtros de contratos' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Fecha final para filtros de contratos' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ example: 'condiciones', description: 'Búsqueda por condiciones del contrato' })
  @IsOptional()
  @IsString()
  search?: string;
}
