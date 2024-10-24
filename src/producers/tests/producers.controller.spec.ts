import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from '../producers.controller';
import { ProducersService } from '../producers.service';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { Chance } from 'chance';
import { NotFoundException } from '@nestjs/common';
import { CropsService } from 'src/crops/crops.service';

const chance = new Chance();

describe('ProducersController', () => {
  let controller: ProducersController;
  let service: ProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        {
          provide: ProducersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getDashboardData: jest.fn(),
          },
        },
        {
          provide: CropsService,
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    service = module.get<ProducersService>(ProducersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service create with the correct parameters', async () => {
      const createProducerDto: CreateProducerDto = {
        document: chance.cpf().replace(/\D/g, ''), // Removendo pontuações para garantir que esteja sem formatação
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state({ full: true }),
        totalArea: 100,
        agriculturalArea: 70,
        vegetationArea: 30,
        crops: [chance.guid(), chance.guid()],
      };

      const mockResponse = { ...createProducerDto, id: chance.guid() };

      jest.spyOn(service, 'create').mockResolvedValue(mockResponse as any);

      const result = await controller.create(createProducerDto);

      expect(service.create).toHaveBeenCalledWith(createProducerDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call service findAll', async () => {
      const producers = [
        {
          id: chance.guid(),
          document: chance.cpf().replace(/\D/g, ''),
          producerName: chance.name(),
          farmName: chance.company(),
          city: chance.city(),
          state: chance.state({ full: true }),
          totalArea: chance.integer({ min: 100, max: 1000 }),
          agriculturalArea: chance.integer({ min: 50, max: 500 }),
          vegetationArea: chance.integer({ min: 10, max: 300 }),
          createdAt: new Date(),
          updatedAt: new Date(),
          crops: [
            { id: chance.guid(), name: 'Soybean' },
            { id: chance.guid(), name: 'Corn' },
          ],
        },
      ];
  
      jest.spyOn(service, 'findAll').mockResolvedValue(producers);
  
      const result = await controller.findAll();
  
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(producers);
    });
  });

  describe('findOne', () => {
    it('should call service findOne with the correct id', async () => {
      const producer = {
        id: chance.guid(),
        document: chance.cpf().replace(/\D/g, ''),
        producerName: chance.name(),
        farmName: chance.company(),
        city: chance.city(),
        state: chance.state({ full: true }),
        totalArea: chance.integer({ min: 100, max: 1000 }),
        agriculturalArea: chance.integer({ min: 50, max: 500 }),
        vegetationArea: chance.integer({ min: 10, max: 300 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        crops: [
          { id: chance.guid(), name: 'Soybean' },
          { id: chance.guid(), name: 'Corn' },
        ],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(producer);

      const result = await controller.findOne(producer.id);

      expect(service.findOne).toHaveBeenCalledWith(producer.id);
      expect(result).toEqual(producer);
    });

    it('should throw an error if producer not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Producer not found'));

      await expect(controller.findOne(chance.guid())).rejects.toThrow(
        'Producer not found',
      );
    });
  });

  describe('getDashboardData', () => {
    it('should call service getDashboardData', async () => {
      const dashboardData = {
        totalFarms: 10,
        totalArea: 1000,
        farmsByState: [
          { state: 'SC', count: 5 },
          { state: 'SP', count: 3 },
        ],
        farmsByCrop: [
          { crop: 'Soybean', count: 6 },
          { crop: 'Corn', count: 4 },
        ],
        landUsage: {
          agriculturalArea: 700,
          vegetationArea: 300,
        },
      };
      
      jest.spyOn(service, 'getDashboardData').mockResolvedValue(dashboardData);

      const result = await controller.getDashboardData();

      expect(service.getDashboardData).toHaveBeenCalled();
      expect(result).toEqual(dashboardData);
    });
  });

  describe('update', () => {
    it('should call service update with the correct parameters', async () => {
      const updateProducerDto: UpdateProducerDto = {
        totalArea: 150,
        agriculturalArea: 100,
        vegetationArea: 50,
        crops: [chance.guid()],
      };
      const producerId = chance.guid();
      const updatedProducer = { id: producerId, ...updateProducerDto };

      jest.spyOn(service, 'update').mockResolvedValue(updatedProducer as any);

      const result = await controller.update(producerId, updateProducerDto);

      expect(service.update).toHaveBeenCalledWith(producerId, updateProducerDto);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('remove', () => {
    it('should call service remove with the correct id', async () => {
      const producerId = chance.guid();
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(producerId);

      expect(service.remove).toHaveBeenCalledWith(producerId);
    });
  });
});
