import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendSmsDto {
  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  body: string;
}
