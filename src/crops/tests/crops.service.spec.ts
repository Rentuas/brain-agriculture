import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CropsService } from '../crops.service';
import { Crops } from '../entities/crop.entity';
import { Chance } from 'chance';

const chance = new Chance();

describe('CropsService', () => {
    let service: CropsService;
    let repository: Repository<Crops>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CropsService,
                {
                    provide: getRepositoryToken(Crops),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<CropsService>(CropsService);
        repository = module.get<Repository<Crops>>(getRepositoryToken(Crops));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all crops', async () => {
            const mockCrops = [
                { id: chance.guid(), name: 'Soybean' },
                { id: chance.guid(), name: 'Corn' },
            ];

            jest.spyOn(repository, 'find').mockResolvedValueOnce(mockCrops as Crops[]);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalled();
            expect(result).toEqual(mockCrops);
        });
    });

    describe('findByIds', () => {
        it('should return crops by ids', async () => {
            const cropIds = [chance.guid(), chance.guid()];
            const mockCrops = [
                { id: cropIds[0], name: 'Soybean' },
                { id: cropIds[1], name: 'Corn' },
            ];

            jest.spyOn(repository, 'findBy').mockResolvedValueOnce(mockCrops as Crops[]);

            const result = await service.findByIds(cropIds);

            expect(repository.findBy).toHaveBeenCalledWith({ id: In(cropIds) });
            expect(result).toEqual(mockCrops);
        });

        it('should return an empty array if no crops match the ids', async () => {
            const cropIds = [chance.guid(), chance.guid()];

            jest.spyOn(repository, 'findBy').mockResolvedValueOnce([]);

            const result = await service.findByIds(cropIds);

            expect(repository.findBy).toHaveBeenCalledWith({ id: In(cropIds) });
            expect(result).toEqual([]);
        });
    });
});