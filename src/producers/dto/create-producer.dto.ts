import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  IsInt,
} from 'class-validator';
import { Document } from 'src/decorators/document.decorator';

export class 
CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor. Deve ser um valor único e válido.',
    example: '12345678900',
  })
  @IsString()
  @IsNotEmpty()
  @Document({
    message: 'O campo document deve ser um CPF ou CNPJ válido, sem pontuações.',
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
    example: 150,
  })
  @IsInt()
  @IsNotEmpty()
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável da fazenda em hectares.',
    example: 120,
  })
  @IsInt()
  @IsNotEmpty()
  agriculturalArea: number;

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares.',
    example: 30,
  })
  @IsInt()
  @IsNotEmpty()
  vegetationArea: number;

  @ApiProperty({
    description: 'Array de UUIDs das culturas plantadas na fazenda.',
    example: ['b3a0f023-4e02-4a43-8f3b-1b53f3d1620d', '6a27bc28-8fcf-4ea5-a1a8-21476f002f30'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'O array de id das culturas plantadas não pode estar vazio.' })
  @IsUUID('all', { each: true, message: 'Cada cultura deve ser um id válido.' })
  crops: string[];
}
