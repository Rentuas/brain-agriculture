import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { CropType } from '../enums/crop-type';
  
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
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalArea: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    agriculturalArea: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    vegetationArea: number;
  
    @Column({
      type: 'enum',
      enum: CropType,
    })
    crops: CropType;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  }