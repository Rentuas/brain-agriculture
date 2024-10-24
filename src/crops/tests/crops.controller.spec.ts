import { Test, TestingModule } from '@nestjs/testing';
import { CropsController } from '../crops.controller';
import { CropsService } from '../crops.service';
import { Chance } from 'chance';

const chance = new Chance();

describe('CropsController', () => {
  let controller: CropsController;
  let service: CropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [
        {
          provide: CropsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CropsController>(CropsController);
    service = module.get<CropsService>(CropsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service findAll and return the crops', async () => {
      const crops = [
        { id: chance.guid(), name: 'Soybean' },
        { id: chance.guid(), name: 'Corn' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(crops);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(crops);
    });
  });
});
