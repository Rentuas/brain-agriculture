import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CropResponseDto } from '../../crops/dto/crop-response.dto';
import { ProducerCrop } from 'src/producer-crops/entities/producer-crops.entity';

export class ProducerResponseDto {
  @ApiProperty({
    description: 'ID do produtor',
    example: 'fa8a6bad-fb21-4f27-9031-d7200191eab9',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Documento do produtor (CPF ou CNPJ)',
    example: '12345678902',
  })
  @Expose()
  document: string;

  @ApiProperty({
    description: 'Nome do produtor',
    example: 'Ivan Sautner',
  })
  @Expose()
  producerName: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda A',
  })
  @Expose()
  farmName: string;

  @ApiProperty({
    description: 'Cidade onde a fazenda está localizada',
    example: 'Indaial',
  })
  @Expose()
  city: string;

  @ApiProperty({
    description: 'Estado onde a fazenda está localizada',
    example: 'SC',
  })
  @Expose()
  state: string;

  @ApiProperty({
    description: 'Área total da fazenda em centímetros quadrados',
    example: 10000,
  })
  @Expose()
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável da fazenda em centímetros quadrados',
    example: 7000,
  })
  @Expose()
  agriculturalArea: number;

  @ApiProperty({
    description: 'Área de vegetação da fazenda em centímetros quadrados',
    example: 2500,
  })
  @Expose()
  vegetationArea: number;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-10-24T00:08:28.568Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do registro',
    example: '2024-10-24T00:08:28.568Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'Culturas associadas ao produtor',
    type: [CropResponseDto],
  })
  @Expose()
  @Type(() => CropResponseDto)
  crops: CropResponseDto[];

  @Exclude()
  producerCrops?: ProducerCrop[]
}