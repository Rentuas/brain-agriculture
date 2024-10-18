import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { Producer } from './entities/producer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  controllers: [ProducersController],
  providers: [ProducersService],
  exports: [ProducersService],
})
export class ProducersModule {}
