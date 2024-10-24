import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProducerCrop } from 'src/producer-crops/entities/producer-crops.entity';
import { Transform } from 'class-transformer';

@Entity('producers')
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  document: string;

  @Column({ type: 'varchar' })
  producerName: string;

  @Column({ type: 'varchar' })
  farmName: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  state: string;

  @Transform(({ value }) => parseInt(value, 10))
  @Column({ type: 'bigint' })
  totalArea: number;

  @Transform(({ value }) => parseInt(value, 10))
  @Column({ type: 'bigint' })
  agriculturalArea: number;

  @Transform(({ value }) => parseInt(value, 10))
  @Column({ type: 'bigint' })
  vegetationArea: number;

  @OneToMany(() => ProducerCrop, (producerCrop) => producerCrop.producer)
  producerCrops: ProducerCrop[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
