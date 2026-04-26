import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RenewContractDto {
  @Type(() => Date)
  @IsDate()
  newEndDate: Date;
}
