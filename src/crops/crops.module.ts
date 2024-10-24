import { Module } from '@nestjs/common';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crops } from './entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crops])],
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService],
})
export class CropsModule {}
