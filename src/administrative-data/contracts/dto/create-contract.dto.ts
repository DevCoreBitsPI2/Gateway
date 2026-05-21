import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { contract_status, StatusContractListDto } from '../enum/contract_status.enum';
import { contract_type, TypeContractListDto } from '../enum/contract_type.enum';

export class CreateContractDto {
  @ApiProperty({ example: 'Contrato a término fijo por 1 año con todas las prestaciones de ley', description: 'Condiciones del contrato' })
  @IsString()
  conditions: string;

  @ApiPropertyOptional({ enum: contract_status, example: contract_status.valid, description: 'Estado del contrato' })
  @IsEnum(contract_status, {
    message: `valid status are: ${StatusContractListDto}`,
  })
  @IsOptional()
  contractStatus?: contract_status;

  @ApiProperty({ enum: contract_type, example: contract_type.fixed_term_contract, description: 'Tipo de contrato' })
  @IsEnum(contract_type, {
    message: `valid types are: ${TypeContractListDto}`,
  })
  contractType: contract_type;

  @ApiProperty({ example: '2025-01-01', description: 'Fecha de inicio del contrato (ISO 8601)' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Fecha de fin del contrato (ISO 8601). Opcional para contratos a término indefinido.', nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date | null;

  @ApiProperty({ example: 10, description: 'ID del empleado asociado al contrato' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  idEmployee: number;

  @ApiProperty({ example: 5, description: 'ID del gerente que firma el contrato' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  idManager: number;
}
