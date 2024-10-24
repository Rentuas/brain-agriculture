import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producer } from 'src/producers/entities/producer.entity';
import { Crops } from 'src/crops/entities/crop.entity';

@Entity('producer_crops')
export class ProducerCrop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Producer, (producer) => producer.producerCrops, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'producer_id' })
  producer: Producer;

  @ManyToOne(() => Crops, (crop) => crop.producerCrops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'crop_id' })
  crop: Crops;
}
