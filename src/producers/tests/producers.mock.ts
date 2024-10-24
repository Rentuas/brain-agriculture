import { Producer } from "../entities/producer.entity";
import { Crops } from "../../crops/entities/crop.entity";
import { Chance } from 'chance';

const chance = new Chance();

export function createMockProducer(overrides = {}): Producer {
    return {
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
          crop: createMockCrop(),
          producer: null,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    } as Producer;
  }
  
export function createMockCrop(overrides = {}): Crops {
  return {
    id: chance.guid(),
    name: chance.word(),
    producerCrops: [],
    ...overrides,
  } as Crops;
}