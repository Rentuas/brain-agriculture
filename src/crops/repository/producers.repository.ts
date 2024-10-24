import { Repository } from 'typeorm';
import { Crops } from './../entities/crop.entity';

export class ProducersRepository extends Repository<Crops> {}
