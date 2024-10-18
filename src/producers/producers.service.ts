import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producersRepository: Repository<Producer>,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    this.validateAreaConsistency(
      createProducerDto.totalArea,
      createProducerDto.agriculturalArea,
      createProducerDto.vegetationArea,
    );

    const producer = this.producersRepository.create(createProducerDto);
    return this.producersRepository.save(producer);
  }

  findAll(): Promise<Producer[]> {
    return this.producersRepository.find();
  }

  findOne(id: string): Promise<Producer | undefined> {
    return this.producersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.findOne(id);

    if (
      updateProducerDto.totalArea !== undefined &&
      updateProducerDto.agriculturalArea !== undefined &&
      updateProducerDto.vegetationArea !== undefined
    ) {
      this.validateAreaConsistency(
        updateProducerDto.totalArea,
        updateProducerDto.agriculturalArea,
        updateProducerDto.vegetationArea,
      );
    }

    const updatedProducer = { ...producer, ...updateProducerDto };
    return this.producersRepository.save(updatedProducer);
  }

  async remove(id: string): Promise<void> {
    const producer = await this.findOne(id);
    await this.producersRepository.remove(producer);
  }

  async getDashboardData() {
    const totalFarms = await this.producersRepository.count();
    const totalArea = await this.producersRepository
      .createQueryBuilder('producer')
      .select('SUM(producer.totalArea)', 'totalArea')
      .getRawOne();

    const farmsByState = await this.producersRepository
      .createQueryBuilder('producer')
      .select('producer.state, COUNT(producer.id) as count')
      .groupBy('producer.state')
      .getRawMany();

    const farmsByCrop = await this.producersRepository
      .createQueryBuilder('producer')
      .select('crops, COUNT(*) as count')
      .groupBy('crops')
      .getRawMany();

    const landUsage = await this.producersRepository
      .createQueryBuilder('producer')
      .select('SUM(producer.agriculturalArea) as agriculturalArea, SUM(producer.vegetationArea) as vegetationArea')
      .getRawOne();

    return {
      totalFarms,
      totalArea: totalArea.totalArea,
      farmsByState,
      farmsByCrop,
      landUsage,
    };
  }

  validateAreaConsistency(totalArea: number, agriculturalArea: number, vegetationArea: number): void {
    if (agriculturalArea + vegetationArea > totalArea) {
      throw new BadRequestException(
        'A soma da área agricultável e de vegetação não pode exceder a área total da fazenda.',
      );
    }
  }
}
