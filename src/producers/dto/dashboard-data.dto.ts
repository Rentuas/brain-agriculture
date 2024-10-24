import { ApiProperty } from '@nestjs/swagger';

class FarmsByStateDto {
  @ApiProperty({
    description: 'Estado onde as fazendas estão localizadas.',
    example: 'SC',
  })
  state: string;

  @ApiProperty({
    description: 'Quantidade de fazendas no estado.',
    example: 5,
  })
  count: number;
}

class FarmsByCropDto {
  @ApiProperty({
    description: 'Nome da cultura plantada.',
    example: 'Soybean',
  })
  crop: string;

  @ApiProperty({
    description: 'Quantidade de fazendas que possuem essa cultura.',
    example: 7,
  })
  count: number;
}

class LandUsageDto {
  @ApiProperty({
    description: 'Área total agricultável em hectares.',
    example: 1200,
  })
  agriculturalArea: number;

  @ApiProperty({
    description: 'Área total de vegetação em hectares.',
    example: 300,
  })
  vegetationArea: number;
}

export class DashboardDataDto {
  @ApiProperty({
    description: 'Total de fazendas registradas.',
    example: 10,
  })
  totalFarms: number;

  @ApiProperty({
    description: 'Área total de todas as fazendas em hectares.',
    example: 1500,
  })
  totalArea: number;

  @ApiProperty({
    description: 'Quantidade de fazendas por estado.',
    type: [FarmsByStateDto],
  })
  farmsByState: FarmsByStateDto[];

  @ApiProperty({
    description: 'Quantidade de fazendas por cultura plantada.',
    type: [FarmsByCropDto],
  })
  farmsByCrop: FarmsByCropDto[];

  @ApiProperty({
    description: 'Uso do solo: áreas agricultáveis e de vegetação.',
    type: LandUsageDto,
  })
  landUsage: LandUsageDto;
}