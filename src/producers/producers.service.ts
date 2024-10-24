import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { CropsService } from 'src/crops/crops.service';
import { ProducerCrop } from 'src/producer-crops/entities/producer-crops.entity';
import { ProducerResponseDto } from './dto/producer-response.dto';
import { plainToInstance } from 'class-transformer';
import { DashboardDataDto } from './dto/dashboard-data.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producersRepository: Repository<Producer>,
    private readonly cropsService: CropsService,
    @InjectRepository(ProducerCrop)
    private readonly producerCropsRepository: Repository<ProducerCrop>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<ProducerResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      this.validateAreaConsistency(
        createProducerDto.totalArea,
        createProducerDto.agriculturalArea,
        createProducerDto.vegetationArea,
      );
  
      const crops = await this.cropsService.findByIds(createProducerDto.crops);
  
      if (crops.length !== createProducerDto.crops.length) {
        throw new BadRequestException('Algumas culturas fornecidas são inválidas.');
      }
  
      const producerDocumentExists = await queryRunner.manager.findOne(Producer, {
        where: { document: createProducerDto.document },
      });
  
      if (producerDocumentExists) {
        throw new BadRequestException('Já existe um produtor com esse documento.');
      }
  
      const createdProducer = queryRunner.manager.create(Producer, {
        ...createProducerDto,
      });
  
      const savedProducer = await queryRunner.manager.save(createdProducer);
  
      const producerCrops = crops.map((crop) =>
        queryRunner.manager.create(ProducerCrop, {
          producer: savedProducer,
          crop,
        }),
      );
  
      await queryRunner.manager.save(producerCrops);
  
      await queryRunner.commitTransaction();
  
      const producer = await this.producersRepository.findOne({
        where: { id: savedProducer.id },
        relations: ['producerCrops.crop'],
      });
  
      return plainToInstance(ProducerResponseDto, {
        ...producer,
        crops: producer.producerCrops.map((producerCrop) => producerCrop.crop),
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page = 1, limit = 10): Promise<ProducerResponseDto[]> {
    const [producers, total] = await this.producersRepository.findAndCount({
      relations: ['producerCrops', 'producerCrops.crop'],
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return producers.map((producer) =>
      plainToInstance(ProducerResponseDto, {
        ...producer,
        crops: producer.producerCrops.map((producerCrop) => producerCrop.crop),
      }),
    );
  }

  async findOne(id: string): Promise<ProducerResponseDto> {
    const producer = await this.producersRepository.findOne({
      where: { id },
      relations: ['producerCrops', 'producerCrops.crop'],
    });
  
    if (!producer) {
      throw new NotFoundException('Producer not found');
    }
  
    return plainToInstance(ProducerResponseDto, {
      ...producer,
      crops: producer.producerCrops.map((producerCrop) => producerCrop.crop),
    });
  }

  async update(
    id: string,
    updateProducerDto: UpdateProducerDto,
  ): Promise<ProducerResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const updatingProducer = await queryRunner.manager.findOne(Producer, {
        where: { id },
        relations: ['producerCrops', 'producerCrops.crop'],
      });
  
      if (!updatingProducer) {
        throw new NotFoundException('Producer not found');
      }
  
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
  
      if (updateProducerDto.crops) {
        const cropsToRemove = updatingProducer.producerCrops.filter(
          (producerCrop) => !updateProducerDto.crops.includes(producerCrop.crop.id),
        );
  
        if (cropsToRemove.length > 0) {
          await queryRunner.manager.remove(ProducerCrop, cropsToRemove);
        }
  
        const newCrops = await this.cropsService.findByIds(updateProducerDto.crops);
        const existingCropsIds = updatingProducer.producerCrops.map(
          (producerCrop) => producerCrop.crop.id,
        );
  
        const cropsToAdd = newCrops.filter(
          (crop) => !existingCropsIds.includes(crop.id),
        );
  
        const newProducerCrops = cropsToAdd.map((crop) =>
          queryRunner.manager.create(ProducerCrop, {
            producer: updatingProducer,
            crop,
          }),
        );
  
        await queryRunner.manager.save(newProducerCrops);
      }
  
      updatingProducer.totalArea = updateProducerDto.totalArea ?? updatingProducer.totalArea;
      updatingProducer.agriculturalArea = updateProducerDto.agriculturalArea ?? updatingProducer.agriculturalArea;
      updatingProducer.vegetationArea = updateProducerDto.vegetationArea ?? updatingProducer.vegetationArea;
  
      await queryRunner.manager.save(updatingProducer);
  
      await queryRunner.commitTransaction();
  
      const producer = await this.producersRepository.findOne({
        where: { id: updatingProducer.id },
        relations: ['producerCrops', 'producerCrops.crop'],
      });
  
      return plainToInstance(ProducerResponseDto, {
        ...producer,
        crops: producer.producerCrops.map((producerCrop) => producerCrop.crop),
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const producer = await queryRunner.manager.findOne(Producer, {
        where: { id },
        relations: ['producerCrops'],
      });
    
      if (!producer) {
        throw new NotFoundException('Producer not found');
      }

      await queryRunner.manager.remove(producer);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getDashboardData(): Promise<DashboardDataDto> {
    const totalFarms = await this.producersRepository.count();
    const totalAreaResult = await this.producersRepository
      .createQueryBuilder('producer')
      .select('SUM(producer.totalArea)', 'totalArea')
      .getRawOne();
    const totalArea = Number(totalAreaResult.totalArea);
  
    const farmsByState = await this.producersRepository
      .createQueryBuilder('producer')
      .select('producer.state as state, COUNT(producer.id) as count')
      .groupBy('producer.state')
      .getRawMany();
  
    const farmsByStateFormatted = farmsByState.map((farm) => ({
      state: farm.state,
      count: Number(farm.count),
    }));
  
    const farmsByCrop = await this.producersRepository
      .createQueryBuilder('producer')
      .leftJoinAndSelect('producer.producerCrops', 'producerCrop')
      .leftJoinAndSelect('producerCrop.crop', 'crop')
      .select('crop.name as crop, COUNT(producer.id) as count')
      .groupBy('crop.name')
      .getRawMany();
  
    const farmsByCropFormatted = farmsByCrop.map((farm) => ({
      crop: farm.crop,
      count: Number(farm.count),
    }));
  
    const landUsageResult = await this.producersRepository
      .createQueryBuilder('producer')
      .select(
        'SUM(producer.agriculturalArea) as agriculturalArea, SUM(producer.vegetationArea) as vegetationArea',
      )
      .getRawOne();
    
    const landUsage = {
      agriculturalArea: Number(landUsageResult.agriculturalarea) || 0,
      vegetationArea: Number(landUsageResult.vegetationarea) || 0,
    };
  
    return plainToInstance(DashboardDataDto, {
      totalFarms,
      totalArea,
      farmsByState: farmsByStateFormatted,
      farmsByCrop: farmsByCropFormatted,
      landUsage,
    });
  }

  validateAreaConsistency(
    totalArea: number,
    agriculturalArea: number,
    vegetationArea: number,
  ): void {
    if (agriculturalArea + vegetationArea > totalArea) {
      throw new BadRequestException(
        'A soma da área agricultável e de vegetação não pode exceder a área total da fazenda.',
      );
    }
  }
}
