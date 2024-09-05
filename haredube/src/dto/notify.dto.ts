import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NotifyDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  link?: string;
}
