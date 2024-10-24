import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CropResponseDto {
  @ApiProperty({
    description: 'ID da cultura',
    example: '098228f7-d7d4-4285-a4a3-186529c25e76',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Soybean',
  })
  @Expose()
  name: string;
}