import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMimeType, IsString } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Array of images in binary format',
  })
  @IsArray()
  @IsString({ each: true })
  @IsMimeType({ each: true })
  images: string[];
}
