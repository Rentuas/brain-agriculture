import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { CropType } from './enums/crop-type';
import { Chance } from 'chance';

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

      jest.spyOn(service, 'create').mockResolvedValue(createProducerDto as any);

      const result = await controller.create(createProducerDto);

      expect(service.create).toHaveBeenCalledWith(createProducerDto);
      expect(result).toEqual(createProducerDto);
    });
  });

  describe('findAll', () => {
    it('should call service findAll', async () => {
      const producers = [{ id: chance.guid(), producerName: chance.name() }];
      jest.spyOn(service, 'findAll').mockResolvedValue(producers as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(producers);
    });
  });

  describe('findOne', () => {
    it('should call service findOne with the correct id', async () => {
      const producer = { id: chance.guid(), producerName: chance.name() };
      jest.spyOn(service, 'findOne').mockResolvedValue(producer as any);

      const result = await controller.findOne(producer.id);

      expect(service.findOne).toHaveBeenCalledWith(producer.id);
      expect(result).toEqual(producer);
    });
  });

  describe('getDashboardData', () => {
    it('should call service getDashboardData', async () => {
      const dashboardData = { totalFarms: 10, totalArea: 1000 };
      jest.spyOn(service, 'getDashboardData').mockResolvedValue(dashboardData as any);

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
