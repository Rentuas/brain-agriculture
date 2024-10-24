import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProducerCrop } from 'src/producer-crops/entities/producer-crops.entity';

@Entity('crops')
export class Crops {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany(() => ProducerCrop, (producerCrop) => producerCrop.crop)
  producerCrops: ProducerCrop[];
}
