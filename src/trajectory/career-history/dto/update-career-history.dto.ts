import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerHistoryDto } from './create-career-history.dto';

export class UpdateCareerHistoryDto extends PartialType(CreateCareerHistoryDto) {

}
