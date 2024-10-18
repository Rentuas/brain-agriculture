import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProducersService } from './producers.service';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Chance } from 'chance';
import { CropType } from './enums/crop-type';

const chance = new Chance();

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: Repository<Producer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Producer),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer successfully', async () => {
      const createProducerDto: CreateProducerDto = {
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 70,
        vegetationArea: 30,
        crops: CropType.Soybean,
      };

      const mockProducer = { ...createProducerDto, id: chance.guid() };

      jest.spyOn(repository, 'create').mockReturnValue(mockProducer as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProducer as any);

      const result = await service.create(createProducerDto);

      expect(repository.create).toHaveBeenCalledWith(createProducerDto);
      expect(repository.save).toHaveBeenCalledWith(mockProducer);
      expect(result).toEqual(mockProducer);
    });

    it('should throw an error when the area is inconsistent', async () => {
      const createProducerDto: CreateProducerDto = {
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 30,
        crops: CropType.Corn
      };

      await expect(service.create(createProducerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a producer successfully', async () => {
      const updateProducerDto: UpdateProducerDto = {
        totalArea: 150,
        agriculturalArea: 100,
        vegetationArea: 50,
      };

      const existingProducer: Producer = {
        id: chance.guid(),
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        crops: CropType.Coffee,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingProducer);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...existingProducer, ...updateProducerDto });

      const result = await service.update(existingProducer.id, updateProducerDto);
      expect(result.totalArea).toBe(150);
      expect(result.agriculturalArea).toBe(100);
      expect(result.vegetationArea).toBe(50);
    });

    it('should throw an error when the updated area is inconsistent', async () => {
      const updateProducerDto: UpdateProducerDto = {
        totalArea: 150,
        agriculturalArea: 100,
        vegetationArea: 60,
      };

      const existingProducer: Producer = {
        id: chance.guid(),
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        crops: CropType.Coffee,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingProducer);

      await expect(service.update(existingProducer.id, updateProducerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a producer successfully', async () => {
      const producer: Producer = {
        id: chance.guid(),
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        crops: CropType.Sugarcane,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(producer);
      jest.spyOn(repository, 'remove').mockResolvedValue(producer);

      await expect(service.remove(producer.id)).resolves.not.toThrow();
    });
  });

  describe('validateAreaConsistency', () => {
    it('should throw an error if the sum of areas exceeds the total area', () => {
      expect(() => {
        service.validateAreaConsistency(100, 70, 40);
      }).toThrow(BadRequestException);
    });

    it('should not throw an error if the sum of areas is within the total area', () => {
      expect(() => {
        service.validateAreaConsistency(100, 60, 30);
      }).not.toThrow();
    });
  });
});
