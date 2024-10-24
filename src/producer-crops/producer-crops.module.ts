import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerCrop } from './entities/producer-crops.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProducerCrop])],
  providers: [],
  exports: [],
})
export class ProducerCropsModule {}
