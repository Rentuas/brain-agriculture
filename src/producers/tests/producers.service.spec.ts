import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ProducersService } from '../producers.service';
import { Producer } from '../entities/producer.entity';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { Chance } from 'chance';
import { CropsService } from 'src/crops/crops.service';
import { ProducerCrop } from 'src/producer-crops/entities/producer-crops.entity';
import { createMockCrop, createMockProducer } from './producers.mock';

const chance = new Chance();

describe('ProducersService', () => {
  let service: ProducersService;
  let cropsService: CropsService;
  let repository: Repository<Producer>;
  let producerCropRepository: Repository<ProducerCrop>;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Producer),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ProducerCrop),
          useClass: Repository,
        },
        {
          provide: CropsService,
          useValue: {
            findByIds: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                findOne: jest.fn(),
                remove: jest.fn().mockResolvedValue(undefined),
                save: jest.fn(),
                create: jest.fn(),
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
    producerCropRepository = module.get<Repository<ProducerCrop>>(getRepositoryToken(ProducerCrop));
    cropsService = module.get<CropsService>(CropsService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of producers', async () => {
      const mockProducers = [
        {
          id: chance.guid(),
          document: chance.cpf(),
          producerName: chance.name(),
          farmName: chance.company(),
          city: chance.city(),
          state: chance.state(),
          totalArea: 100,
          agriculturalArea: 70,
          vegetationArea: 30,
          producerCrops: [
            {
              id: chance.guid(),
              producer: null,
              crop: { id: chance.guid(), name: 'Soybean', producerCrops: [] },
            },
            {
              id: chance.guid(),
              producer: null,
              crop: { id: chance.guid(), name: 'Corn', producerCrops: [] },
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
  
      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([mockProducers, 1]);
  
      const result = await service.findAll(1, 10);
  
      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['producerCrops', 'producerCrops.crop'],
        skip: 0,
        take: 10,
      });
  
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockProducers[0].id);
      expect(result[0].crops.length).toBe(mockProducers[0].producerCrops.length);
      expect(result[0].crops[0].name).toBe(mockProducers[0].producerCrops[0].crop.name);
    });
  });

  describe('findOne', () => {
    it('should return a producer when found', async () => {
      const mockProducer = {
        id: chance.guid(),
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 70,
        vegetationArea: 30,
        producerCrops: [
          {
            id: chance.guid(),
            producer: null,
            crop: {
              id: chance.guid(),
              name: 'Soybean',
              producerCrops: [],
            },
          },
          {
            id: chance.guid(),
            producer: null,
            crop: {
              id: chance.guid(),
              name: 'Corn',
              producerCrops: [],
            },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

    
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockProducer as any);
    
      const result = await service.findOne(mockProducer.id);
    
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducer.id },
        relations: ['producerCrops', 'producerCrops.crop'],
      });
    
      expect(result.id).toBe(mockProducer.id);
      expect(result.crops.length).toBe(mockProducer.producerCrops.length);
      expect(result.crops[0].name).toBe(mockProducer.producerCrops[0].crop.name);
    });
    
    it('should throw a NotFoundException when producer is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    
      await expect(service.findOne(chance.guid())).rejects.toThrow(
        NotFoundException,
      );
    });
    
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
        crops: [chance.guid(), chance.guid()],
      };

      const mockCrops = createProducerDto.crops.map((id) => ({
        id,
        name: chance.word(),
      }));
    
      const mockProducer = { ...createProducerDto, id: chance.guid() };

      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(queryRunner.manager, 'create').mockReturnValue(mockProducer as any);
      jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(mockProducer);
      jest.spyOn(queryRunner, 'commitTransaction').mockResolvedValue(undefined);
      jest.spyOn(queryRunner, 'rollbackTransaction').mockResolvedValue(undefined);
      jest.spyOn(queryRunner, 'release').mockResolvedValue(undefined);

      jest.spyOn(cropsService, 'findByIds').mockResolvedValue(mockCrops);

      const producer = {
        ...mockProducer,
        producerCrops: [
          {
            id: chance.guid(),
            crop: { id: chance.guid(), name: 'Soybean' },
          },
        ],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(producer as any);

      const result = await service.create(createProducerDto);

      expect(cropsService.findByIds).toHaveBeenCalledWith(createProducerDto.crops);
      expect(queryRunner.manager.create).toHaveBeenCalledWith(Producer, createProducerDto);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockProducer);
      expect(repository.findOne).toHaveBeenCalled();
      expect(result.id).toBe(mockProducer.id); 
      expect(result.crops.length).toBe(producer.producerCrops.length);
      expect(result.crops[0].name).toBe(producer.producerCrops[0].crop.name);
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
        crops: [],
      };

      await expect(service.create(createProducerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if some crops provided are invalid', async () => {
      const createProducerDto: CreateProducerDto = {
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 70,
        vegetationArea: 30,
        crops: [chance.guid(), chance.guid()],
      };
  
      const validCrops = [
        { id: createProducerDto.crops[0], name: 'Corn' },
      ];
  
      jest.spyOn(cropsService, 'findByIds').mockResolvedValue(validCrops);
  
      await expect(service.create(createProducerDto)).rejects.toThrow(
        new BadRequestException('Algumas culturas fornecidas são inválidas.'),
      );
    });

    it('should throw BadRequestException if a producer with the same document already exists', async () => {
      const createProducerDto: CreateProducerDto = {
        document: chance.cpf(),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state(),
        totalArea: 100,
        agriculturalArea: 70,
        vegetationArea: 30,
        crops: [],
      };
  
      const existingProducer = { ...createProducerDto, id: chance.guid() };
  
      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(existingProducer);
  
      await expect(service.create(createProducerDto)).rejects.toThrow(
        new BadRequestException('Já existe um produtor com esse documento.'),
      );
    });
  });

  describe('update', () => {
    it('should update a producer successfully', async () => {
      const updateProducerDto: UpdateProducerDto = {
        totalArea: 150,
        agriculturalArea: 100,
        vegetationArea: 50,
        crops: [chance.guid(), chance.guid()]
      };

      const cropToRemove = createMockCrop({ id: chance.guid() });
      const cropToAdd = createMockCrop({ id: updateProducerDto.crops[1] });
      const cropToKeep = createMockCrop({ id: updateProducerDto.crops[0] });
    
      const existingProducer = createMockProducer({
        producerCrops: [
          {
            id: chance.guid(),
            crop: cropToRemove,
            producer: null,
          },
          {
            id: chance.guid(),
            crop: cropToKeep,
            producer: null,
          },
        ],
      });

      existingProducer.producerCrops.forEach((producerCrop) => (producerCrop.producer = existingProducer));
    
      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(existingProducer);
      jest.spyOn(cropsService, 'findByIds').mockResolvedValueOnce([cropToKeep, cropToAdd]);

      jest.spyOn(queryRunner.manager, 'remove').mockResolvedValue(undefined);
      
      const updatedProducer = {
        ...existingProducer,
        ...updateProducerDto,
        producerCrops: [
          { id: chance.guid(), crop: cropToKeep, producer: existingProducer },
          { id: chance.guid(), crop: cropToAdd, producer: existingProducer },
        ],
      };

      jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(updatedProducer);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(updatedProducer);

      
      const result = await service.update(existingProducer.id, updateProducerDto);
    
      expect(cropsService.findByIds).toHaveBeenCalledWith(updateProducerDto.crops);
      expect(queryRunner.manager.remove).toHaveBeenCalledWith(ProducerCrop, [existingProducer.producerCrops[0]]);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(existingProducer);
      expect(result.totalArea).toBe(150);
      expect(result.agriculturalArea).toBe(100);
      expect(result.vegetationArea).toBe(50);
      expect(result.crops.length).toBe(2);
      expect(result.crops[0].id).toBe(cropToKeep.id);
      expect(result.crops[1].id).toBe(cropToAdd.id);
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
        producerCrops: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProducer = {
        ...existingProducer,
        ...updateProducerDto
      };

      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValue(existingProducer);
      jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(updatedProducer);
      jest.spyOn(queryRunner, 'commitTransaction').mockResolvedValue(undefined);
      jest.spyOn(queryRunner, 'rollbackTransaction').mockResolvedValue(undefined);

      await expect(
        service.update(existingProducer.id, updateProducerDto),
      ).rejects.toThrow(BadRequestException);
    });

    it(`should throw a NotFoundException when producer is not found`, async () => {
      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(null);
    
      await expect(service.update(chance.guid(), {})).rejects.toThrow(
        NotFoundException,
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
        producerCrops: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValue(producer);
      jest.spyOn(queryRunner.manager, 'remove').mockResolvedValue(undefined);

      await expect(service.remove(producer.id)).resolves.not.toThrow();
    });

    it('should throw an error if producer is not found', async () => {
      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValue(null);

      await expect(service.remove(chance.guid())).rejects.toThrow(
        'Producer not found',
      );
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

  describe('dashboard', () => {
    it('should return correct dashboard data', async () => {

      jest.spyOn(repository, 'count').mockResolvedValue(10);

      const totalAreaQueryBuilderMock = {
          select: jest.fn().mockReturnThis(),
          getRawOne: jest.fn().mockResolvedValue({ totalArea: '1000' }),
      };

      const farmsByStateQueryBuilderMock = {
          select: jest.fn().mockReturnThis(),
          groupBy: jest.fn().mockReturnThis(),
          getRawMany: jest.fn().mockResolvedValue([
              { state: 'SC', count: '5' },
              { state: 'RS', count: '5' },
          ]),
      };

      const farmsByCropQueryBuilderMock = {
          select: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          groupBy: jest.fn().mockReturnThis(),
          getRawMany: jest.fn().mockResolvedValue([
              { crop: 'Soybean', count: '6' },
              { crop: 'Corn', count: '4' },
          ]),
      };

      const landUsageQueryBuilderMock = {
          select: jest.fn().mockReturnThis(),
          getRawOne: jest.fn().mockResolvedValue({
              agriculturalarea: '700',
              vegetationarea: '300',
          }),
      };

      jest.spyOn(repository, 'createQueryBuilder')
          .mockImplementationOnce(() => totalAreaQueryBuilderMock as any)
          .mockImplementationOnce(() => farmsByStateQueryBuilderMock as any)
          .mockImplementationOnce(() => farmsByCropQueryBuilderMock as any)
          .mockImplementationOnce(() => landUsageQueryBuilderMock as any);

      const result = await service.getDashboardData();

      expect(result.totalFarms).toBe(10);
      expect(result.totalArea).toBe(1000);
      expect(result.farmsByState).toEqual([
          { state: 'SC', count: 5 },
          { state: 'RS', count: 5 },
      ]);
      expect(result.farmsByCrop).toEqual([
          { crop: 'Soybean', count: 6 },
          { crop: 'Corn', count: 4 },
      ]);
      expect(result.landUsage).toEqual({
          agriculturalArea: 700,
          vegetationArea: 300,
      });
    });
  })
});
