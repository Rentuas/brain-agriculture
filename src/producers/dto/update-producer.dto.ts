import { PartialType } from '@nestjs/mapped-types';
import { CreateProducerDto } from './create-producer.dto';
import { IsAreaConsistent } from '@validators/validate-all-areas.decorator';

@IsAreaConsistent()
export class UpdateProducerDto extends PartialType(CreateProducerDto) {}
