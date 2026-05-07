import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class RenewContractDto {
  @ApiProperty({ example: '2027-01-01', description: 'Nueva fecha de fin del contrato (ISO 8601)' })
  @Type(() => Date)
  @IsDate()
  newEndDate: Date;
}
