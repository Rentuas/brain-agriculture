import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { Producer } from './entities/producer.entity';
import { CropsModule } from 'src/crops/crops.module';
import { ProducerCrop } from 'src/producer-crops/entities/producer-crops.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producer, ProducerCrop]), CropsModule],
  controllers: [ProducersController],
  providers: [ProducersService],
  exports: [ProducersService],
})
export class ProducersModule {}
