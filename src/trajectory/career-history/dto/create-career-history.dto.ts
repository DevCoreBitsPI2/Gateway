import { Type } from "class-transformer";
import { IsDate, IsNumber, isNumber, IsPositive, IsString, IsEnum } from "class-validator";
import { career_type_change, CareerTypeChangeListDto } from "../enum/career_type_change";
export class CreateCareerHistoryDto {
    @IsString()
    description: string

    @IsDate()
    @Type(() => Date)
    event_date: Date

    @IsEnum(CareerTypeChangeListDto,
        { message: `type must be one of the following values: ${CareerTypeChangeListDto}` }
    )
    type: career_type_change

    @IsNumber()
    @IsPositive()
    id_employee: number
}