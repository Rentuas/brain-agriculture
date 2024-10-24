import { Injectable } from '@nestjs/common';
import { Crops } from './entities/crop.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CropResponseDto } from './dto/crop-response.dto';

@Injectable()
export class CropsService {
    constructor(
        @InjectRepository(Crops)
        private readonly cropsRepository: Repository<Crops>,
    ) {}

    findAll(): Promise<CropResponseDto[]> {
        return this.cropsRepository.find();
    }

    findByIds(ids: string[]): Promise<CropResponseDto[]> {
        return this.cropsRepository.findBy({ id: In(ids) })
    }
}
