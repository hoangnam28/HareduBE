import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubscribeDTO {
  @ApiProperty()
  @IsNotEmpty()
  subscriber: string;

  @ApiProperty()
  @IsNotEmpty()
  owner: string;
}
