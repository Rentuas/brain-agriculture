import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, Matches } from 'class-validator';
import { CropType } from '../enums/crop-type';

export class CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor. Deve ser um valor único e válido.',
    example: '123.456.789-00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'O campo document deve ser um CPF ou CNPJ válido.',
  })
  document: string;

  @ApiProperty({
    description: 'Nome do produtor.',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  producerName: string;

  @ApiProperty({
    description: 'Nome da fazenda do produtor.',
    example: 'Fazenda Boa Vista',
  })
  @IsString()
  @IsNotEmpty()
  farmName: string;

  @ApiProperty({
    description: 'Cidade onde a fazenda está localizada.',
    example: 'Blumenau',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Estado onde a fazenda está localizada.',
    example: 'Santa Catarina',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Área total da fazenda em hectares.',
    example: 150.5,
  })
  @IsNumber()
  @IsNotEmpty()
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável da fazenda em hectares.',
    example: 120.0,
  })
  @IsNumber()
  @IsNotEmpty()
  agriculturalArea: number;

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares.',
    example: 30.5,
  })
  @IsNumber()
  @IsNotEmpty()
  vegetationArea: number;

  @ApiProperty({
    description: 'Tipo de cultura plantada na fazenda.',
    example: CropType.Soybean,
    enum: CropType,
  })
  @IsEnum(CropType)
  @IsNotEmpty()
  crops: CropType;
}
