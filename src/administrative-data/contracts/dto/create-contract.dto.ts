import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { contract_status, StatusContractListDto } from '../enum/contract_status.enum';
import { contract_type, TypeContractListDto } from '../enum/contract_type.enum';

export class CreateContractDto {
  @IsString()
  conditions: string;

  @IsEnum(contract_status, {
    message: `valid status are: ${StatusContractListDto}`,
  })
  @IsOptional()
  contractStatus?: contract_status;

  @IsEnum(contract_type, {
    message: `valid types are: ${TypeContractListDto}`,
  })
  contractType: contract_type;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  idEmployee: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  idManager: number;
}
