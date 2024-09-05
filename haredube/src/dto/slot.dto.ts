import { Slot } from '@models/slot.model';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSlotDto extends PickType(Slot, ['title', 'classroomId', 'description', 'startTime', 'endTime']) {}

export class CreateManySlotDto {
  @ApiProperty()
  @IsNotEmpty()
  slots: CreateSlotDto[];

  @ApiProperty()
  @IsNotEmpty()
  classroomId: string;
}

export class SetUidDto {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  uid: string;
}
